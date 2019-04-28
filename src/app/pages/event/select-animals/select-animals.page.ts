import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import * as _ from "lodash";


import {MenuItem} from 'primeng/api';

import {
    Animal,
    APIService,
    MeetingService
} from "../../../modules";

@Component({
    selector: 'page-event-select-animals',
    templateUrl: 'select-animals.html',
    styleUrls: ['select-animals.scss'],
})
export class SelectAnimalsPage implements OnInit, OnDestroy {

    constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService, private meetingService: MeetingService) { }

    private paramsSub: Subscription;
    private eventId: number;
    private animalsSelectedInitial: any;

    public animals: Observable<Animal[]>;

    public animalsRows: any;
    public animalsSelected: Array<Object> = [];

    public config: any = {
        columns: [],
        filters: {},
        canSelect: true,
        view: 'animalsForEvent'
    };

    public saveDisabled: Boolean = true;

    public menuConfig: any;

    ngOnInit(): void {
        
        this.paramsSub = this.route.params.subscribe(params => {

            this.config.canSelect = (params.action == 'update')

            this.eventId = +params["id"];

            switch (this.config.view){
                case 'animalsForEvent':
                    this.animals = this.apiService.getAnimalsForEvent(this.eventId, true)
                    break;
                case 'animalsForMeeting':
                default:
                    this.animals = this.meetingService.getEventAnimals(this.eventId);
                    break;
            }
         
            // Age: { title: "Age", valuePrepareFunction: (val)=>{  return `${Math.floor(val/12)} Y, ${val % 12} M` }, compareFunction: (a,b,c)=>{ return (a==1 ? b-c : c-b)} }, 

            this.config.columns = [
                {field:"CoverPhoto",header:"Photo", default: true, style: {'width.px':60}},
                {field:"Name",header:"Name",filter:'search', default: true, style: {'width.px':130}},
                {field:"Breed",header:"Breed",filter:'multiselect', default: true},
                {field:"Sex",header:"Sex",filter:'multiselect', default: true, style: {'width.px':80}},
                {field:"CurrentWeightPounds",header:"Weight",filter:'multiselect', default: true, style: {'width.px':85}},
                {field:"Age",header:"Age",filter:'multiselect', default: true, style: {'width.px':100}},
                {field:"Color",header:"Color",filter:'multiselect', default: true, style: {'width.px':120}},
                {field:"Fee",header:"Fee",filter:'multiselect', default: true, style: {'width.px':80}},
                {field:"currentStatus",header:"Status",filter:'multiselect', default: true, style: {'width.px':130}},
                {field:"adoptionCounselor",header:"Counselor",filter:'multiselect', default: false},
                {field:"adopter",header:"Adopter",filter:'multiselect', default: false}
            ]

            this.config.selectedColumns = _.filter(this.config.columns,'default')

            this.animals.subscribe((animals) => {

                this.animalsSelected = [
                    ..._.filter(animals,'selected')
                ]

                if (!this.animalsSelectedInitial) this.animalsSelectedInitial = _.cloneDeep(this.animalsSelected)

                this.onRowSelect(null)

                _.forEach(animals,function(e){
                    try {
                        e._styleClass=[]

                        let ageInMonths = _.toInteger(e.Age)
                        let years = Math.floor(ageInMonths/12)
                        e.Age = `${years} Y, ${ageInMonths % 12} M`
                        // e.Age = _.toInteger(e.Age)
                        e.Fee = e.AdoptionFeeGroup ? e.AdoptionFeeGroup.Name : null;
                        e.CurrentWeightPounds = _.toInteger(e.CurrentWeightPounds)

                        e.currentMeeting = _.find(e.__animalMeetings__, m => (!m.concludedAt || m.adopted));

                        if (_.get(e,'currentMeeting.adopted') || e.Status == 'Healthy In Home') {
                            e.currentStatus = 'Adopted'
                            e._styleClass.push('animal-adopted')
                        }
                        else if (_.get(e,'currentMeeting.createdAt') && _.get(e,'currentMeeting.concludedAt')==null) {
                            e.currentStatus = 'In Meeting'
                            e._styleClass.push('animal-in-meeting')
                        }
                        else if (e.selected && e.Status == 'Available') {
                            e.currentStatus = 'Available'
                            e._styleClass.push('animal-available')
                        } else {
                            e.currentStatus = e.Status
                        }

                        e.adoptionCounselor = _.get(e,'currentMeeting.__adoptionCounselor__') ? `${e.currentMeeting.__adoptionCounselor__.firstName} ${_.first(e.currentMeeting.__adoptionCounselor__.lastName)}.` : '';
                        e.adopter = _.get(e,'currentMeeting.__adopter__') ? `${e.currentMeeting.__adopter__.firstName} ${e.currentMeeting.__adopter__.lastName}`: '';
                    } catch(err) {
                        console.log(err)
                    }

                    return e
                })

                if (this.animalsSelected.length==0) {
                    this.config.canSelect = true
                }

                if (!this.config.canSelect) animals = _.filter(animals,'selected')

                this.animalsRows = [..._.sortBy(animals,['selected','name'])]

                this.config.columns.forEach((col)=>{
                    this.config.filters[col.field] = _.chain(animals).map(col.field).uniq().sort().map((e)=>{ return {label: e, value: e}}).value()
                })

            })
        });
    }

    ngOnDestroy(): void {
        this.paramsSub.unsubscribe();
    }

    hasSelectedAnimals(): boolean {
        return _.get(this,'animalsSelected',[]).length > 0;
    }

    toEvent():  void {
        this.router.navigate(["events", this.eventId])
    }

    onRowSelect(event){
        let diff1 = _.differenceBy(this.animalsSelected, this.animalsSelectedInitial, 'externalId')
        let diff2 = _.differenceBy(this.animalsSelectedInitial, this.animalsSelected, 'externalId')

        this.saveDisabled = (diff1.length + diff2.length) == 0
    }

    submitAnimals(): void {
        let self = this
        this.apiService.setAnimalsInEvent(
            this.eventId,
            _.map(this.animalsSelected,'externalId')
        ).subscribe(()=>{
            self.toEvent()
        });
    }
}
