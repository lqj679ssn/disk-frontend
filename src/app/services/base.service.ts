import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Resp} from "../models/resp";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Info} from "../models/info";

@Injectable()
export class BaseService {
  public static asyc_working = 0;
  public static info_center = new Subject<Info>();
  public token: string;
  public front_host: string;
  private host: string;
  private qn_host: string;
  constructor(
    private http: HttpClient,
  ) {
    this.front_host = "https://d.6-79.cn";
    this.host = "https://disk.6-79.cn";
    this.qn_host = "https://upload.qiniu.com";
    this.token = null;
  }
  private static handleError(error: any): Promise<any> {
    BaseService.asyc_working -= 1;
    return Promise.reject(error);
  }
  private static handleHTTP(o: Observable<Object>) {
    return o.toPromise()
      .then((resp: Resp) => {
        if (resp.code !== 0) {
          // return BaseService.handleError(resp.msg);
          BaseService.info_center.next(new Info({text: resp.msg, type: Info.TYPE_WARN}));
        } else {
          BaseService.asyc_working -= 1;
          return resp.body;
        }
      })
      .catch(BaseService.handleError);
  }
  public static path_to_slug(path: Array<any>) {
    return path.join('-');
  }
  get_option(data = {}) {
    const httpHeaders = new HttpHeaders({'Token': this.token});
    // httpHeaders.append('Token', this.get_token());
    return {
      headers: httpHeaders,
      params: data,
    };
  }
  get(url: string, data: object = null) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.get(this.host + url, this.get_option(data)));
  }
  post(url: string, data) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.post(this.host + url, data, this.get_option()));
  }
  put(url: string, data) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.put(this.host + url, data, this.get_option()));
  }
  del(url: string) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.delete(this.host + url, this.get_option()));
  }
  get is_loading() {
    return BaseService.asyc_working > 0;
  }
  post_qn(data) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.post(this.qn_host, data));
  }
}