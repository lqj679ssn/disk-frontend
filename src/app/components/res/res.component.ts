import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Resource } from "../../models/res/resource";
import { ClockService } from "../../services/clock.service";
import { ResourceService } from "../../services/resource.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FootBtnService } from "../../services/foot-btn.service";
import { FootBtn } from "../../models/res/foot-btn";
import { Subject } from "rxjs/Subject";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { BaseService } from "../../services/base.service";
import { Info } from "../../models/base/info";
import { Meta } from "@angular/platform-browser";
import { DeleteResItem } from "../../models/res/delete-res-item";
import { Observable } from "rxjs";

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  styleUrls: [
    '../../../assets/css/mywebicon.css',
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/nav.less',
    '../../../assets/css/footer.less',
    '../../../assets/css/res.less'
  ],
})
export class ResComponent implements OnInit {
  static sort_accord = 'name';
  static sort_ascend = true;
  static icon_width = 66;

  res_str_id: string;

  resource: Resource;
  children: Resource[];
  search_list: Resource[];

  search_value: string;
  search_terms: Subject<string>;

  search_mode: boolean;
  tab_mode: string;

  sort_mode: boolean;  // 排序模式 分为name time type

  visit_key: string;  // 资源密钥

  description: string;  // 资源描述

  total_del_num: number;  // 所有待删除的资源数目
  current_del_num: number;  // 当前正在删除的数目
  current_path: string;  // 当前删除的路径
  show_deleting_process: boolean; // 是否进入删除画面

  margin_left: number;

  constructor(
    public baseService: BaseService,
    public userService: UserService,
    public resService: ResourceService,
    public clockService: ClockService,
    public footBtnService: FootBtnService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private meta: Meta,
  ) {
    this.resource = null;
    this.res_str_id = '';
    this.visit_key = null;
    this.search_list = [];
    this.search_value = null;
    this.search_mode = false;
    this.sort_mode = false;
    this.current_del_num = 0;
    this.total_del_num = 0;
    this.show_deleting_process = false;
    this.margin_left = 0;
  }
  baseInitResource(resp) {
    this.children = [];
    this.resource = new Resource(this.baseService, resp.info);
    this.description = this.resource.description;
    if (!this.description && !this.is_mine) {
      this.description = '暂无介绍资料';
    }
    for (const item of resp.child_list) {
      item.parent_str_id = this.resource.res_str_id;
      const r_child = new Resource(null, item);
      this.children.push(r_child);
    }
    this.resource_search();
    this.meta.updateTag({name: 'description', content: `${this.resource.owner.nickname}分享了“${this.resource.rname}”，快来看看吧！`});
    this.meta.updateTag({name: 'image', content: this.resource.owner.avatar});
  }
  initResLose(base_resp) {
    base_resp.info.rtype = Resource.RTYPE_ENCRYPT;
    this.resource = new Resource(this.baseService, base_resp.info);
    this.description = '无法查看介绍资料';
    this.children = [];
    this.search_list = this.children.concat();
  }
  initResource() {
    const v_key = ResourceService.loadVK(this.res_str_id);
    this.resService.get_base_res_info(this.res_str_id)
      .then((base_resp) => {
        // console.log(resp);
        if (base_resp.readable || v_key) {
          this.resService.get_res_info(this.res_str_id, {visit_key: v_key})
            .then((resp) => {
              this.baseInitResource(resp);
            })
            .catch(() => {
              ResourceService.clearVK(this.res_str_id);
              this.initResLose(base_resp);
            });
        } else {
          this.initResLose(base_resp);
        }
        this.baseService.is_jumping = false;
      });
      // .catch(msg => console.log(msg));
  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.res_str_id = params['slug'];

      this.initResource();
      this.clockService.startClock();
      this.search_mode = false;
      this.tab_mode = 'resource';
    });
    this.search_terms = new Subject<string>();
    this.search_terms
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(keyword => this.resource_search(keyword));
    Observable.fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.do_swipe(0);
      });
  }

  do_swipe(delta) {
    const total_width = Math.max(this.foot_btns.length * ResComponent.icon_width, window.innerWidth);
    let margin_left = this.margin_left + delta;
    if (margin_left > 0) {
      margin_left = 0;
    }
    if (-margin_left + window.innerWidth > total_width) {
      margin_left = window.innerWidth - total_width;
    }
    this.margin_left = margin_left;
  }

  footer_swipe($event) {
    const delta = $event.deltaX * 2;
    this.do_swipe(delta);
  }

  get del_percent() {
    return Math.floor(this.current_del_num / this.total_del_num * 100) + '%';
  }

  async recursiveDelete(delete_res_list: Array<DeleteResItem>) {
    for (let index = 0; index < delete_res_list.length; index++) {
      const delete_res_item = delete_res_list[index];
      const resp = await this.resService.get_res_info(delete_res_item.res_id, null);
      if (resp.info.sub_type === Resource.STYPE_FOLDER) {
        this.total_del_num += resp.child_list.length;
        for (let i = 0; i < resp.child_list.length; i++) {
          const child_res_id = resp.child_list[i].res_str_id;
          const child_readable_path = delete_res_item.readable_path + "   /   " + resp.child_list[i].rname;
          if (resp.child_list[i].sub_type === Resource.STYPE_FOLDER) {
            await this.recursiveDelete([new DeleteResItem({
              res_str_id: child_res_id,
              readable_path: child_readable_path,
            })]);
          } else {
            this.current_del_num += 1;
            // console.log(child_res_id);
            this.current_path = child_readable_path;
            await this.resService.delete_res(child_res_id);
            // await this.fake_wait();
          }
        }
      }
      this.current_del_num += 1;
      this.current_path = delete_res_item.readable_path;
      await this.resService.delete_res(delete_res_item.res_id);
      // await this.fake_wait();
      // console.log(deleteResItem.path);
    }
  }

  fake_wait() {
    return new Promise((resolve, object) => {
      setTimeout(() => resolve(), 2000);
    });
  }

  resource_search(keyword: string = null) {
    if (!keyword) {
      keyword = "";
    }
    if (this.search_value) {
      keyword = this.search_value;
    }
    this.search_list = [];
    for (const item of this.children) {
      if (item.rname.indexOf(keyword) >= 0) {
        this.search_list.push(item);
      }
    }
    this.sort_by(true);
  }

  select_res(res: Resource) {
    res.selected = !res.selected;
  }

  select_res_help(help: string) {
    if (help === 'all') {
      for (const item of this.search_list) {
        item.selected = true;
      }
    } else if (help === 'adverse') {
      for (const item of this.search_list) {
        item.selected = !item.selected;
      }
    } else if (help === 'cancel') {
      for (const item of this.search_list) {
        item.selected = false;
      }
      this.footBtnService.foot_btn_active = null;
    } else if (help === 'delete') {
      const delete_list = [];
      for (const item of this.search_list) {
        if (item.selected) {
          delete_list.push(new DeleteResItem({
            res_str_id: item.res_str_id,
            readable_path: this.resource.rname + '   /   ' + item.rname,
          }));
        }
      }
      // this.show_deleting_process = true;
      this.footBtnService.foot_btn_active = null;
      this.start_delete(delete_list, () => {
        this.resService.get_res_info(this.res_str_id, null)
          .then((resp) => {
            this.baseInitResource(resp);
          });
      });
    }
  }

  start_delete(delete_list: Array<DeleteResItem>, callback) {
    this.show_deleting_process = true;
    this.current_del_num = 0;
    this.total_del_num = delete_list.length;
    this.recursiveDelete(delete_list)
      .then(() => {
        BaseService.info_center.next(new Info({text: '批量删除成功', type: Info.TYPE_SUCC}));
        if (callback) {
          callback();
        }
        setTimeout(() => {
          this.show_deleting_process = false;
        }, 300);
      })
      .catch(() => {
        setTimeout(() => {
          this.show_deleting_process = false;
        }, 300);
      });
  }

  get active_real_deleting() {
    return this.show_deleting_process ? 'active' : 'inactive';
  }

  go_search(searching: boolean) {
    this.search_mode = searching;
  }

  clear_search() {
    this.search_value = null;
    this.resource_search();
  }

  get search_class() {
    return this.search_mode ? 'searching' : '';
  }

  get sort_class() {
    return this.sort_mode ? 'sorting' : '';
  }

  navigate(res_str_id) {
    const link = ['/res', res_str_id];
    this.baseService.is_jumping = true;
    this.router.navigate(link)
      .then();
  }

  go_parent($event = null) {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.resource.is_home) {
      return;
    }
    const link = ['/res', this.resource.parent_str_id];
    this.baseService.is_jumping = true;
    this.router.navigate(link)
      .then();
  }

  get foot_btns() {
    const _foot_btns = [];
    for (const foot_btn of this.footBtnService.foot_btn_list) {
      if (this.resource && !foot_btn.hide) {
        if ((this.resource.is_folder && foot_btn.folder) ||
          (!this.resource.is_folder && foot_btn.file)) {
          if (foot_btn === this.footBtnService.foot_btn_delete && this.resource.is_home) {
            continue;
          }
          _foot_btns.push(foot_btn);
        }
      }
    }
    return _foot_btns;
  }

  get show_op_footer() {
    return this.userService.user && this.resource && this.userService.user.user_id === this.resource.owner.user_id;
  }

  get dl_link() {
    return `${this.baseService.host}/api/res/${this.resource.res_str_id}/dl?` +
      `token=${BaseService.token}&visit_key=${this.resource.visit_key}`;
  }

  switch_tab_mode(tm: string) {
    this.tab_mode = tm;
  }

  sort_by_time(ra: Resource, rb: Resource) {
    if (ResComponent.sort_ascend) {
      return ra.create_time - rb.create_time;
    } else {
      return rb.create_time - ra.create_time;
    }
  }

  sort_by_type(ra: Resource, rb: Resource) {
    if (ResComponent.sort_ascend) {
      return ra.sub_type - rb.sub_type;
    } else {
      return rb.sub_type - ra.sub_type;
    }
  }

  sort_by_name(ra: Resource, rb: Resource) {
    if (ResComponent.sort_ascend) {
      return ra.rname.localeCompare(rb.rname, 'zh');
    } else {
      return -ra.rname.localeCompare(rb.rname, 'zh');
    }
  }

  toggle_sort_mode() {
    this.sort_mode = !this.sort_mode;
  }

  sort_by(follow_last, accord = null) {
    if (!follow_last) {
      if (ResComponent.sort_accord === accord) {
        ResComponent.sort_ascend = !ResComponent.sort_ascend;
      } else {
        ResComponent.sort_accord = accord;
        ResComponent.sort_ascend = true;
      }
    }
    switch (ResComponent.sort_accord) {
      case 'time':
        this.search_list.sort(this.sort_by_time);
        break;
      case 'name':
        this.search_list.sort(this.sort_by_name);
        break;
      case 'type':
        this.search_list.sort(this.sort_by_type);
        break;
      default:
        break;
    }
    this.sort_mode = false;
  }

  get show_side_icon() {
    return this.resource && this.resource.is_folder && this.tab_mode === 'resource' && !this.search_mode;
  }

  activate_btn(btn: FootBtn) {
    this.footBtnService.activate_btn(btn);
    if (this.footBtnService.foot_btn_active === this.footBtnService.foot_btn_select) {
      this.tab_mode = "resource";
    }
  }

  get is_modifying_desc() {
    return this.footBtnService.is_modifying && this.tab_mode === 'description';
  }

  go_modify_desc() {
    this.footBtnService.foot_btn_active = this.footBtnService.foot_btn_modify;
  }

  cancel_modify_desc() {
    if (this.resource) {
      this.description = this.resource.description;
    } else {
      this.description = '';
    }
    this.footBtnService.foot_btn_active = null;
  }

  modify_desc_action() {
    this.resService.modify_res_info(this.res_str_id,
      {rname: null, description: this.description, visit_key: null, status: null, right_bubble: null})
      .then((resp) => {
        this.resource.update(null, resp);
        this.description = this.resource.description;
        this.footBtnService.foot_btn_active = null;
      });
  }

  onUploaded(res: Resource) {
    this.children.push(res);
    this.resource_search();
  }

  onDeleted() {
    const delete_list = [new DeleteResItem({res_str_id: this.res_str_id, readable_path: this.resource.rname})];
    this.start_delete(delete_list, () => {
      this.go_parent();
    });
  }

  get resource_title() {
    if (this.search_value && this.resource && this.resource.rtype === Resource.RTYPE_FOLDER) {
      let _v = '';
      if (this.search_value.length > 2) {
        _v = this.search_value.substr(0, 2) + '…';
      } else {
        _v = this.search_value;
      }
      return `搜索“${_v}”的结果`;
    }
    return '资源';
  }

  get is_mine() {
    return this.resource && this.userService.user && this.userService.user.user_id === this.resource.owner.user_id;
  }

  go_login() {
    if (this.userService.user) {
      this.router.navigate(['/res']);
    } else {
      window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
    }
  }

  check_visit_key() {
    this.resService.get_res_info(this.res_str_id, {visit_key: this.visit_key})
      .then((resp) => {
        ResourceService.storeVK(this.res_str_id, this.visit_key);
        this.baseInitResource(resp);
        BaseService.info_center.next(new Info({text: '成功获取资源', type: Info.TYPE_SUCC}));
      });
  }
}
