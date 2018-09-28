import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { APIService } from "./api.service";
import { SocketService } from "./socket.service";

import { BASE_RESCUE_TRACKS_URL } from "../../constants";

@NgModule({
    imports: [
        HttpClientModule,
    ],
    providers: [
        APIService,
        SocketService,
        {
          provide: BASE_RESCUE_TRACKS_URL,
          useValue: "http://localhost:9000", // "https://rescue-tracks.herokuapp.com",
        }
    ],
})
export class APIModule {}
