import { LightningElement,api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class DrapAndDropCard extends NavigationMixin(LightningElement) {
    @api stage;
    @api record;

    get isSameStage() {
        return this.stage === this.record.StageName
    }
    navigationOppHandler(event) {
        event.preventDefault();
        this.navigationHandler(event.target.dataset.id,'Opportunity');
    }
    navigationAccHandler(event) {
        event.preventDefault();
        this.navigationHandler(event.target.dataset.id,'Account');
        
    }
    navigationHandler(Id,apiname) {
        
        this[NavigationMixin.Navigate]({
            type : 'standard__recordPage',
            attributes : {
                recordId: Id,
                objectApiName: apiname,
                actionName:'view'
            }
        })
    }
    itemDragStart() {
        const event = new CustomEvent('itemdrag', {
            detail : this.record.Id
        })
        this.dispatchEvent(event);
    }
}