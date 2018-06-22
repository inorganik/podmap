import { Component } from '@angular/core';

@Component({
  selector: 'pm-forbidden',
  template: `<h5>Forbidden</h5>
    <p>You must be an admin to access this section.</p>`
})
export class ForbiddenComponent {

  constructor() { }

}
