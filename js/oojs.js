class Item {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
  
    render() {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<strong>${this.name}</strong> – ${this.price} Ft`;
      return div;
    }
  }
  
  class FoodItem extends Item {
    constructor(name, price, expirationDate) {
      super(name, price);
      this.expirationDate = expirationDate;
    }
  
    render() {
      const div = super.render();
      const p = document.createElement('p');
      p.textContent = `Lejárat: ${this.expirationDate}`;
  
      const btn = document.createElement('button');
      btn.textContent = 'Törlés';
      btn.onclick = () => {
        div.remove();
        items = items.filter(i => i !== this);
      };
  
      div.appendChild(p);
      div.appendChild(btn);
      return div;
    }
  }
  
  let items = [];
  
  const form = document.getElementById('item-form');
  const result = document.getElementById('oojs-result');
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const expiration = document.getElementById('expiration').value;
  
    const item = new FoodItem(name, price, expiration);
    items.push(item);
  
    result.appendChild(item.render());
    form.reset();
  });
  