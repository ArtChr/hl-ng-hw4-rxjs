import { Observable, Observer, fromEvent, from, of } from 'rxjs'
import { IResults, ICharacter } from './character.interface';
import { switchMap, debounceTime, distinctUntilChanged, map, throttleTime } from 'rxjs/operators';


const getBtn: HTMLButtonElement | null = document.getElementById('get') as HTMLButtonElement;
const nameFilter: HTMLInputElement | null = document.querySelector('#nameFilter') as HTMLInputElement;
const aliveCb: HTMLInputElement | null = document.querySelector('#alive') as HTMLInputElement;
const rickAndMortyCharacters = `https://rickandmortyapi.com/api/character/`;

const getData = (data: ICharacter) => {
  const template: HTMLTemplateElement | null = document.getElementById('template-card') as HTMLTemplateElement;
  const containter: HTMLDivElement | null = document.querySelectorAll('.container')[1] as HTMLDivElement;
  console.log(data);
  containter.innerHTML = '';
  const holder = document.createElement('div');
  holder.classList.add('d-flex', 'flex-wrap', 'justify-content-center');
  if (data && data.results) {
    data.results.forEach((item: IResults, index: number) => {
      const card = document.importNode(template.content, true);
      holder.appendChild(card);
      const image = holder.getElementsByClassName('card-img-top')[index] as HTMLImageElement;
      const title = holder.getElementsByClassName('card-title')[index] as HTMLHeadElement;
      const parag = holder.getElementsByClassName('card-text')[index] as HTMLParagraphElement;
      const alert = holder.getElementsByClassName('card-alert')[index] as HTMLDivElement;
      image.src = item.image;
      title.innerText = item.name;
      parag.innerText = item.species + (item.gender !== 'unknown' ? ` (${item.gender})` : '');
      alert.innerText = item.status;
      switch(item.status) {
        case 'Alive':
          alert.classList.add('alert-success');
          break;
        case 'Dead':
          alert.classList.add('alert-danger');
          break;
        default:
          alert.classList.add('alert-secondary');
      }
    });
  } else {
    containter.innerHTML = '<div class="alert alert-warning">There is nothing here<div>';
  }
  containter.appendChild(holder);
};

const click$: Observable<ICharacter> = fromEvent(getBtn, 'click').pipe(
  throttleTime(2000),
  switchMap(() => {
    return from(
      fetch(rickAndMortyCharacters)
      .then((res: Response) => res.json())
    )
  })
);

const input$: Observable<ICharacter> = fromEvent(nameFilter, 'input').pipe(
  map((event: Event) => (event.target as HTMLInputElement).value),
  debounceTime(1000),
  switchMap((value: string) => {
    return from(
      fetch(`${rickAndMortyCharacters}?name=${value}`)
      .then((res: Response) => res.json())
    )
  })
);

const aliveCheck$: Observable<ICharacter> = fromEvent(aliveCb, 'click').pipe(
  map((event: Event) => (event.target as HTMLInputElement).checked),
  debounceTime(1000),
  switchMap((value: boolean) => {
    return from(
      fetch(value ? `${rickAndMortyCharacters}?status=alive` : rickAndMortyCharacters)
      .then((res: Response) => res.json())
    )
  })
);

click$.subscribe((data: ICharacter) => getData(data))
input$.subscribe((data: ICharacter) => getData(data));
aliveCheck$.subscribe((data: ICharacter) => getData(data));




