const baseUrl = 'http://localhost';


const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');

// Função auxiliar para carregar o HTML e retornar o documento DOM
async function loadHTML(html) {
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  await dom.window.document.readyState === 'complete';
  return dom.window.document;
}

describe('Contact List tests', () => {
  let document;
  let contacts;

  beforeAll(async () => {
    // Definir uma lista de contatos simulada
    contacts = [
      { id: 1, name: 'John Doe', href: '/contacts/1' },
      { id: 2, name: 'Jane Smith', href: '/contacts/2' },
      { id: 3, name: 'Alice Johnson', href: '/contacts/3' }
    ];
    
    // Carregar o HTML antes de cada teste
    document = await loadHTML(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Contact List</title>
        </head>
        <body>
          <ul class="contact-list">
            ${contacts.map(contact => `
              <li>
                <a href="/contacts/${contact.id}" hx-get="/contacts/${contact.id}" hx-target="#content" hx-push-url="true">${contact.name}</a>
              </li>
            `).join('')}
          </ul>
          <div class="actions">
            <a href="/contacts/new" hx-get="/contacts/new" hx-target="#content" hx-push-url="true">New Contact</a>
          </div>
        </body>
      </html>
    `);
  });

  it('deve renderizar uma lista de contatos com links para os detalhes de cada contato', () => {
    const contactList = document.querySelector('.contact-list');
    expect(contactList).toBeTruthy();
  
    const contactItems = contactList.querySelectorAll('li');
    expect(contactItems.length).toBe(contacts.length);
  
    contactItems.forEach((contactItem, index) => {
      const contactLink = contactItem.querySelector('a');
      expect(contactLink.href).toBe(`${baseUrl}${contacts[index].href}`);
      expect(contactLink.textContent).toBe(contacts[index].name);
    });
  });
  
  it('deve conter um link para adicionar um novo contato', () => {
    const newContactLink = document.querySelector('.actions a');
    expect(newContactLink.href).toBe(`${baseUrl}/contacts/new`);
    expect(newContactLink.textContent).toBe('New Contact');
  });
  
  // Mais testes podem ser adicionados para verificar outros aspectos da lista de contatos
});
