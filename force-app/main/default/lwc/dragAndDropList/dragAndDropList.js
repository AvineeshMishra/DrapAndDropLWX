import { LightningElement,api } from 'lwc';

export default class DragAndDropList extends LightningElement {
    @api records;
    @api stage;

    handleItemDrag(eve) {
        const event = new CustomEvent('listitemdrag', {
            detail : eve.detail
        })
        this.dispatchEvent(event);
    }
    handleDrop(eve) {
        const event = new CustomEvent('itemdrop', {
            detail : this.stage
        })
        this.dispatchEvent(event);
    }
    handleDragOver(eve) {
        eve.preventDefault();
    }
}