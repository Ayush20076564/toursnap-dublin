import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Platform,
  IonRouterOutlet,
  ModalController,
  PopoverController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;

  // Pages where back button should EXIT the app
  private readonly rootRoutes = ['/places'];

  constructor(
    private platform: Platform,
    private router: Router,

    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {
    this.setupHardwareBackButton();
  }

  private setupHardwareBackButton() {
    this.platform.backButton.subscribeWithPriority(9999, async () => {
      // 1) Close overlays first (modal/popover/actionsheet/alert)
      const topModal = await this.modalCtrl.getTop();
      if (topModal) {
        await topModal.dismiss();
        return;
      }

      const topPopover = await this.popoverCtrl.getTop();
      if (topPopover) {
        await topPopover.dismiss();
        return;
      }

      const topActionSheet = await this.actionSheetCtrl.getTop();
      if (topActionSheet) {
        await topActionSheet.dismiss();
        return;
      }

      const topAlert = await this.alertCtrl.getTop();
      if (topAlert) {
        await topAlert.dismiss();
        return;
      }

      // 2) If we can go back in Ionic stack, go back
      if (this.routerOutlet?.canGoBack()) {
        await this.routerOutlet.pop();
        return;
      }

      // 3) If on root route, exit app
      const currentUrl = this.router.url.split('?')[0];
      if (this.rootRoutes.includes(currentUrl)) {
        await App.exitApp();
        return;
      }

      // 4) Otherwise go to root
      this.router.navigateByUrl('/places', { replaceUrl: true });
    });
  }
}
