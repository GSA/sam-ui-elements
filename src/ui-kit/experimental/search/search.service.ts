import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class PrototypeSearchService{
  
  results:{
    name: string,
    domain: string,
    title?: string
  }[] = [
    {
      "name": "Department of Education",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Energy",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of the Treasury",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Emergency Services and Public Protection",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Education, South Carolina",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Corrections Massachusetts",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Assistive and Rehabilitative Services",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Health Minnesota",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Human Resources",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of General Services",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "Department of Off Street Parking of the city of Miami",
      "domain": "Federal Hierarchy"
    },
    {
      "name": "16.829",
      "title": "Juvenile Justice Education Collaboration Assistance",
      "domain": "Assistance Listing"
    },
    {
      "name": "16.828",
      "title": "Swift, Certain, and Fair (SCF) Sanctions program: Replicating the Concepts behind Project HOPE",
      "domain": "Assistance Listing"
    },
    {
      "name": "16.827",
      "title": "Justice Reinvestment Initiative",
      "domain": "Assistance Listing"
    },
    {
      "name": "Mechanical Services, Inc. Action Obligation $16.82 BPA CALL",
      "title": "Justice Reinvestment Initiative",
      "domain": "Contract Data"
    }
  ]
  
  constructor(
    private http: HttpClient
  ){}
  
  
  public loadData(query: string) {
    return Observable.from([this.results]).map(response => {
      return response.map(item => {
        
        let description;
        
        let regex = new RegExp(query, 'gi');
        let match;
        if(match = regex.exec(item.name)){
          let wordLength = parseInt(match.index + query.length);
          if(match.index === 0){
            description = `${item.name.slice(match.index, wordLength)}<b>${item.name.slice(wordLength)}</b>`;
          }else{
            description = `<b>${item.name.slice(0, match.index)}</b>${item.name.slice(match.index, wordLength)}<b>${item.name.slice(wordLength)}</b>`;
          }
          
          if(item.domain === 'Assistance Listing'){
            description = `${item.name.slice(match.index, wordLength)}<b>${item.name.slice(wordLength)}</b>`;
            description = `${description} ${item.title}`;
          }
        }
        
        return {
          name: item.name,
          domain: (query.length >= 14 || item.domain === 'Assistance Listing') ? `in ${item.domain}` : false,
          description: description
        }
        
      }).filter( item => item.description);
    });
  }
  
  search(query: string){
    let headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3.text-match+json'
    });
    const url = 'https://api.github.com/search/repositories'
    const params: string = [
      `q=${query}`
    ].join('&');
    const queryUrl = `${url}?${params}`;
    return this.http.get(queryUrl, { headers }).map(response=>{
      return response['items'].map(item => {
        
        let matchedObj = {};
        
        item.text_matches.map((match, index) => {
          matchedObj[index] = matchedObj[index] || {};
          matchedObj[index]['fragment'] = match.fragment;
          matchedObj[index]['property'] = match.property;
          match.matches.map(matched => {
            matchedObj[index]['text'] = matchedObj[index]['text'] || [];
            matchedObj[index]['text'].push(matched.text);
          });
          for (var matchedItem in matchedObj){
            let stringsFounds = matchedObj[matchedItem].text.join('|')
            let regexp = new RegExp(stringsFounds, "gi");
            item[matchedObj[matchedItem].property] = matchedObj[matchedItem].fragment.replace(regexp, function(str){
              return `<strong>${str}</strong>`;
            });
          }
        })
        
        return {
          name: item.name,
          description: item.description
        }
        
      }).filter( item => item.description);
    });
    
  }
}