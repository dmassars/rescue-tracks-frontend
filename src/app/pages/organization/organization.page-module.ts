import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { OrganizationModule } from "./organization.module";

import {
  JoinPage,
  ManagePage,
} from ".";

import { OrganizationRoutes } from "./organization.routes";

@NgModule({
  declarations: [
    // Pages
    JoinPage,
    ManagePage,
  ],
  imports: [
    CommonModule,
    FormsModule,

    OrganizationModule,

    OrganizationRoutes,
  ],
})
export class OrganizationPageModule { }