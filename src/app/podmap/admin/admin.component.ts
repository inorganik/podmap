import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { PodcastSuggestion } from '../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  suggestions: Observable<PodcastSuggestion[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.suggestions = afs.collection<PodcastSuggestion>('suggestions').valueChanges();
  }

  approve() {
    // todo
  }

  reject() {
    // todo
  }

  signOut() {
    console.log('bye');
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/search');
  }

}
