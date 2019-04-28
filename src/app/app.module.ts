import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { HomePage } from "./pages/home/home";

import { APIModule } from "./modules/api";
import { APIInterceptor } from "./modules/api/api.interceptor";
import { AuthenticationModule } from "./modules/authentication";
import { AuthenticationInterceptor } from "./modules/authentication/authentication.interceptor";

import { AppComponent } from "./app.component";

import { ModalModule } from "./modules/components/modal";

import { routes } from "./routes";

@NgModule({
    declarations: [
        AppComponent,
        HomePage,
    ],
    imports: [
        APIModule,
        AuthenticationModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        CommonModule,

        ModalModule,

        RouterModule.forRoot(routes),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },{
            provide: HTTP_INTERCEPTORS,
            useClass: APIInterceptor,
            multi: true,
        }

    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
