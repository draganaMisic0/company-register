export class Asset{

    id; 
    name; 
    barcode; 
    description;
    photoUrl; 
    creationDate; 
    price; 
    currentLocation;
    oldLocation; 
    currentEmployee; 
    oldEmployee; 

    constructor(id, name, barcode, description, photoUrl, creationDate, price, currentLocation, 
        oldLocation, currentEmployee, oldEmployee){
        
        this.id=id; 
        this.name=name; 
        this.barcode=barcode; 
        this.description=description;
        this.photoUrl=photoUrl; 
        this.creationDate=creationDate; 
        this.price=price; 
        this.currentLocation=currentLocation; 
        this.oldLocation=oldLocation; 
        this.currentEmployee=currentEmployee; 
        this.oldEmployee=oldEmployee; 
    }
}