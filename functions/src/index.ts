import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// everytime a podcast is added, increment the total podcast count
//
// NOT USED
// this works, but it is quite a bit slower then just making
// a call from the frontend!
export const onPodcastAdd = functions.firestore.document('podcasts/{podcastId}')
  .onCreate(() => {
    const countsRef = admin.firestore().doc('meta/counts');
    return admin.firestore().runTransaction(tx => {
      return tx.get(countsRef).then(counts => {
        if (counts.exists) {
          const newCount = counts.data().podcastCount + 1;
          tx.update(countsRef, { podcastCount: newCount })
        } else {
          tx.set(countsRef, { podcastCount: 1 });
        }
      });
    }).catch(error => console.log('onPodcastAdd:', error));
  });
