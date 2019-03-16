import { Component, Input, OnInit, OnDestroy,  TemplateRef, ViewChild  } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import * as _ from "lodash";

import {
    Animal,
    EventModel,

    APIService,
    EventService,
} from "../../../modules";

@Component({
    selector: 'page-event-select-animals',
    templateUrl: 'select-animals.html',
    styleUrls: ['select-animals.scss'],
})
export class SelectAnimalsPage implements OnInit, OnDestroy {

    constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) { }

    private paramsSub: Subscription;
    private eventId: number;

    public animals: Observable<Animal[]>;
    public selectedAnimals: {[key: number]: boolean};

    public animalsColumns: any;
    public animalsRows: any;
    public animalsSelected: any;

    @ViewChild('animalThumbnail') animalThumbnail: TemplateRef<any>;

    onSelect({ selected }) {
        console.log('Select Event', selected, this.animalsSelected);
      }

    ngOnInit(): void {
        this.selectedAnimals = {};
        this.paramsSub = this.route.params.subscribe(params => {
            this.eventId = +params["id"];
            this.animals = this.apiService.getAnimalsForEvent(this.eventId, true);

            this.animalsColumns = [
                {cellTemplate: this.animalThumbnail, name: '', prop: 'CoverPhoto'},
                {prop: 'Name'},
                {prop: 'Breed'},
                {prop: 'Sex'},
                {prop: 'CurrentWeightPounds', name: 'Weight'},
                {prop: 'Age'},
                {prop: 'Color'},
                {prop: 'Fee'}

            ]

            this.animals.subscribe((animals) => {
                this.animalsSelected = [
                    ..._.filter(animals,'selected')
                ]
                this.animalsRows = [...
                    _.forEach(animals,(e)=>{ 
                        let ageInMonths = _.toInteger(e.Age)
                        let years = Math.floor(ageInMonths/12)
                        let months = ageInMonths % 12

                        e.Age = `${years} Y, ${months} M`
                        e.Fee = e.AdoptionFeeGroup.Name

                        return e
                    })
                ]
                console.log(animals)

                _.chain(animals)
                    .filter("selected")
                    .map("externalId")
                    .each((id: number) => {
                        this.selectedAnimals[id] = true;

                    })
                    .value()
                })
        });
    }

    ngOnDestroy(): void {
        this.paramsSub.unsubscribe();
    }

    toggle(id: number): void {
        this.selectedAnimals[id] = !this.selectedAnimals[id];
    }

    hasSelectedAnimals(): boolean {
        return (_.reject(this.selectedAnimals, (val) => !val).length) > 0;
    }

    submitAnimals(): void {
        this.apiService.setAnimalsInEvent(
            this.eventId,
            _.chain(this.selectedAnimals).pickBy(val => val).keys().value()
        ).subscribe(() => {
            this.router.navigate(["events", this.eventId])
        });
    }
}
