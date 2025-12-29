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
import { SplashScreen } from '@capacitor/splash-screen'; // ✅ add

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;

  private readonly rootRoutes = ['/places'];

  constructor(
    private platform: Platform,
    private router: Router,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      this.keepSplashForMoment(); // ✅ add
      this.setupHardwareBackButton();
    });
  }

  private async keepSplashForMoment() {
    try {
      // keep it visible for 1.5 sec (change to 1000 or 2000)
      setTimeout(() => {
        SplashScreen.hide();
      }, 1500);
    } catch (e) {
      // ignore if plugin not available (web)
    }
  }

  private setupHardwareBackButton() {
    this.platform.backButton.subscribeWithPriority(9999, async () => {
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

      if (this.routerOutlet?.canGoBack()) {
        await this.routerOutlet.pop();
        return;
      }

      const currentUrl = this.router.url.split('?')[0];
      if (this.rootRoutes.includes(currentUrl)) {
        await App.exitApp();
        return;
      }

      this.router.navigateByUrl('/places', { replaceUrl: true });
    });
  }
}
