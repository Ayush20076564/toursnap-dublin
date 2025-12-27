import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

import { JournalService, JournalEntry } from '../../services/journal.service';

type JournalEntryUI = JournalEntry & { photoSrcs: string[] };

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class JournalPage implements OnInit {
  entries: JournalEntryUI[] = [];

  isModalOpen = false;
  selected: JournalEntryUI | null = null;

  constructor(
    private journal: JournalService,
    private router: Router,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  private async load() {
    const raw = this.journal.getAll();

    const mapped: JournalEntryUI[] = [];
    for (const e of raw) {
      const photoSrcs: string[] = [];
      for (const f of e.photoFiles || []) {
        try {
          photoSrcs.push(await this.journal.getDisplaySrcForSavedFile(f));
        } catch {
          // ignore missing/corrupted file
        }
      }
      mapped.push({ ...e, photoSrcs });
    }

    this.entries = mapped;
  }

  openEntry(e: JournalEntryUI) {
    this.selected = e;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    setTimeout(() => (this.selected = null), 50);
  }

  // ✅ EDIT: close modal first, then navigate
  async editSelected() {
    if (!this.selected) return;

    const placeId = this.selected.placeId;
    const entryId = this.selected.id;

    console.log('EDIT route =>', `/journal-edit/${placeId}?entryId=${entryId}`);

    // 1) close overlay
    this.isModalOpen = false;

    // 2) wait one tick so Ionic actually removes the overlay
    await new Promise((r) => setTimeout(r, 0));

    // 3) navigate to edit
    this.router.navigate(['/journal-edit', placeId], {
      queryParams: { entryId },
    });

    // 4) clear selection (prevents old modal content flashing on back)
    setTimeout(() => (this.selected = null), 50);
  }

  // ✅ DELETE: confirm using AlertController (reliable inside modal)
  async askDeleteSelected() {
    if (!this.selected) return;

    const entryId = this.selected.id;

    const a = await this.alert.create({
      header: 'Delete entry?',
      message: 'This will remove the journal entry from offline storage.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            this.journal.delete(entryId);
            this.closeModal();
            (await this.toast.create({ message: 'Deleted ✅', duration: 1200 })).present();
            await this.load();
          },
        },
      ],
    });

    await a.present();
  }
}
