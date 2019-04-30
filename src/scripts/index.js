import '../styles/index.scss';

class SocialFeed {

  constructor(options){

    this.defaultOptions = {
      limit: 8,
      interval: 5000,
    };
    this.options = { 
      ...this.defaultOptions, 
      ...options
    };
    this.wrap = document.querySelector(options.wrap)  
    this.sinceId = null
    if( typeof this.options.api === 'string' && this.options.api && this.wrap){
       this.getPosts();
      } else {
        console.error('Wrong type')
      }
  }


  getPosts(){
    fetch(this.getFullApi())
      .then(response => response.json())
      .then(data => {
        if(data && data.length){
          this.sinceId = data[0].entity_id;
          this.render(data);
        }
        setTimeout(() => {
          this.getPosts();
        }, this.options.interval);
      })
      .catch((error) => {
        console.error('Request failed', error)
      });
  }

  getFullApi() {
    return `${this.options.api}?limit=${this.options.limit}&reverse=1${this.sinceId ? `&from_id=${this.sinceId}` : ''}`;
  }

  getDate(item){
    const currentDate = new Date(item),
      day = currentDate.getDate(),
      mounth = currentDate.getMonth() + 1,  
      year = currentDate.getFullYear(),
      hours = currentDate.getHours(),
      minutes = currentDate.getMinutes(),
      addZero = (time) => {
        return time < 10? '0'+ time : time
      };
    return `${day}.${mounth}.${year} ${addZero(hours)}:${addZero(minutes)}`
  }
  createTemplate(item){
    return `
        <div class="card-body">
            <h4 class="card-title">Author name: ${item.user.name}</h4>
            <p class="card-text">Message: ${item.text}</p>
            <p class="card-text">Post date: ${this.getDate(item.created_at)}</p>
        </div>`;
  }

  removeItems(){
    const elements = this.wrap.querySelectorAll('.list-item');
    const items = [...elements];
    let limimItems = items.splice(this.options.limit);
    limimItems.forEach(i => {
      i.remove();
    });
  }

  render(elems) {
    const frag = document.createDocumentFragment();
    elems.forEach(elem => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = this.createTemplate(elem);
      frag.appendChild(div);
    })
    
    this.wrap.insertBefore(frag, this.wrap.childNodes[0]);
    this.removeItems();  
  }
}

new SocialFeed({limit: 6, interval: 1000, api: 'http://api.massrelevance.com/MassRelDemo/kindle.json', wrap:'.list'});