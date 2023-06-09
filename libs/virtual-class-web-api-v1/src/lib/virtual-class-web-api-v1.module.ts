import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clients } from "./clients";
import { VirtualClassConfigModule } from "@virtual-class-frontend/virtual-class-config";
import { HttpClientModule } from "@angular/common/http";
import { states } from "./stores/states";
import { StoreModule } from "@ngrx/store";
import { featureName, reducers } from "./stores/reducers";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    VirtualClassConfigModule,
    StoreModule.forFeature(featureName, reducers),
  ],
})
export class VirtualClassWebApiV1Module {
  static forRoot(): ModuleWithProviders<VirtualClassWebApiV1Module> {
    return {
      ngModule: VirtualClassWebApiV1Module,
      providers: [
        ...clients,
        ...states,
        // ...guards,
      ],
    };
  }
}
