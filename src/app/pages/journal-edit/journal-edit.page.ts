import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ToastController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { JournalService, PhotoItem, JournalEntry } from '../../services/journal.service';
import { PlacesService, Place } from '../../services/places.service';

@Component({
  selector: 'app-journal-edit',
  templateUrl: './journal-edit.page.html',
  styleUrls: ['./journal-edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class JournalEditPage implements OnInit {
  place: Place | null = null;
  note = '';
  photos: PhotoItem[] = [];
  saving = false;

  // ✅ edit mode
  editingEntryId: string | null = null;
  originalCreatedAt: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private journal: JournalService,
    private places: PlacesService,
    private toast: ToastController,
    private actionSheet: ActionSheetController,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    const placeId = this.route.snapshot.paramMap.get('id');
    if (!placeId) return;

    // ✅ ensure places loaded for getById
    await this.places.ensureLoaded();
    this.place = this.places.getById(placeId) || null;

    if (!this.place) {
      (await this.toast.create({ message: 'Place not found', duration: 1800 })).present();
      return;
    }

    // ✅ If opened from Journal->Edit
    const entryId = this.route.snapshot.queryParamMap.get('entryId');
    if (entryId) {
      const existing = this.journal.getById(entryId);
      if (existing) {
        this.editingEntryId = existing.id;
        this.originalCreatedAt = existing.createdAt;

        this.note = existing.note || '';
        this.photos = [];

        for (const f of existing.photoFiles || []) {
          try {
            const src = await this.journal.getDisplaySrcForSavedFile(f);
            this.photos.push({ fileName: f, previewSrc: src });
          } catch {
            // ignore broken file
          }
        }
      }
    }
  }

  async addPhoto() {
    const sheet = await this.actionSheet.create({
      header: 'Add Photo',
      buttons: [
        {
          text: 'Take photo (Save to Gallery)',
          icon: 'images-outline',
          handler: async () => this.capture(true),
        },
        {
          text: 'Take photo (App only)',
          icon: 'camera-outline',
          handler: async () => this.capture(false),
        },
        {
          text: 'Choose from Gallery',
          icon: 'image-outline',
          handler: async () => this.pickFromGallery(),
        },
        { text: 'Cancel', role: 'cancel', icon: 'close' },
      ],
    });

    await sheet.present();
  }

  private async capture(saveToGallery: boolean) {
    try {
      const photo = await this.journal.takePhotoAndSaveToAppStorage({ saveToGallery });
      this.photos.push(photo);

      (await this.toast.create({
        message: saveToGallery
          ? 'Photo added + saved to Gallery ✅'
          : 'Photo added (stored in app) ✅',
        duration: 1400,
      })).present();
    } catch {
      (await this.toast.create({ message: 'Camera failed', duration: 1500 })).present();
    }
  }

  private async pickFromGallery() {
    try {
      const photo = await this.journal.pickFromGalleryAndSaveToAppStorage();
      this.photos.push(photo);

      (await this.toast.create({
        message: 'Photo picked ✅',
        duration: 1200,
      })).present();
    } catch {
      (await this.toast.create({ message: 'Pick failed', duration: 1500 })).present();
    }
  }

  removePhoto(i: number) {
    this.photos.splice(i, 1);
  }

  async save() {
    if (!this.place) {
      (await this.toast.create({ message: 'Place not found', duration: 1500 })).present();
      return;
    }
    if (!this.note.trim() && this.photos.length === 0) {
      (await this.toast.create({ message: 'Add a note or photo 🙂', duration: 1500 })).present();
      return;
    }

    const confirm = await this.alert.create({
      header: this.editingEntryId ? 'Update Journal?' : 'Save Journal?',
      message: 'This will be saved offline on your device.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: this.editingEntryId ? 'Update' : 'Save', role: 'confirm' },
      ],
    });

    await confirm.present();
    const res = await confirm.onDidDismiss();
    if (res.role !== 'confirm') return;

    this.saving = true;

    const entry: JournalEntry = {
      id: this.editingEntryId ?? (globalThis.crypto?.randomUUID?.() ?? String(Date.now())),
      placeId: this.place.id,
      placeName: this.place.name,
      note: this.note.trim(),
      createdAt: this.originalCreatedAt ?? Date.now(),
      photoFiles: this.photos.map((p) => p.fileName),
    };

    if (this.editingEntryId) this.journal.update(entry);
    else this.journal.add(entry);

    this.saving = false;

    (await this.toast.create({
      message: this.editingEntryId ? 'Updated ✅' : 'Saved ✅',
      duration: 1200,
    })).present();

    history.back();
  }
}
