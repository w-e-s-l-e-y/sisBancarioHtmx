const { JSDOM } = require('jsdom');

// Função auxiliar para carregar o HTML e retornar o documento DOM
async function loadHTML(html) {
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  await dom.window.document.readyState === 'complete';
  return dom.window.document;
}

describe('Contact Details tests', () => {
  let document;
  let contact;

  beforeAll(async () => {
    // Definir um objeto de contato simulado
    contact = {
      id: 123,
      name: "John Doe",
      email: "john.doe@example.com"
    };

    // Carregar o HTML antes de cada teste
    document = await loadHTML(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Contact Details</title>
        </head>
        <body>
          <h2 id="contact-name"></h2>
          <p id="name"></p>
          <p id="email"></p>
          <div class="actions">
            <form id="delete-form" method="POST" action="/delete/${contact.id}?_method=DELETE">
              <button type="submit" class="link">Delete Contact</button>
            </form>
            <a id="edit-link" href="/contacts/${contact.id}/edit">Edit Contact</a>
          </div>
        </body>
      </html>
    `);

    // Preencher os elementos HTML com os dados do contato simulado
    const contactName = document.getElementById('contact-name');
    contactName.textContent = contact.name;

    const nameElement = document.getElementById('name');
    nameElement.textContent = `Name: ${contact.name}`;

    const emailElement = document.getElementById('email');
    emailElement.textContent = `Email: ${contact.email}`;
  });

  it('deve exibir o nome do contato no título', () => {
    const contactName = document.getElementById('contact-name');
    expect(contactName.textContent).toBe(contact.name);
  });

  it('deve exibir o nome e email do contato nos elementos p', () => {
    const nameElement = document.getElementById('name');
    expect(nameElement.textContent).toContain(contact.name);

    const emailElement = document.getElementById('email');
    expect(emailElement.textContent).toContain(contact.email);
  });

  it('deve conter botão para excluir contato', () => {
    const deleteForm = document.getElementById('delete-form');
    expect(deleteForm).toBeTruthy();
  });

  it('deve conter link para editar contato', () => {
    const editLink = document.getElementById('edit-link');
    expect(editLink).toBeTruthy();
  });

  // Mais testes podem ser adicionados para verificar outros aspectos da página

});
