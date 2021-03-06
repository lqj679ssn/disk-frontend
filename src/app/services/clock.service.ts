import {Injectable} from "@angular/core";

@Injectable()
export class ClockService {
  public static ct: number; // current timestamp
  private static time_interval = null;
  private static refreshTime() {
    const current_time = new Date();
    // utc_ts_offset = current_time.getTimezoneOffset() * 60;
    ClockService.ct = current_time.getTime() / 1000;
  }
  public startClock() {
    clearInterval(ClockService.time_interval);
    ClockService.time_interval = setInterval(ClockService.refreshTime, 60000);
    ClockService.refreshTime();
  }
}
