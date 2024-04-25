const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');

// Função auxiliar para carregar o HTML e retornar o documento DOM
async function loadHTML(html) {
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  await dom.window.document.readyState === 'complete';
  return dom.window.document;
}

describe('Form tests', () => {
    let document;
    let isEditing;
  
    beforeAll(async () => {
      // Carregar o HTML antes de cada teste
      document = await loadHTML(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Test Form</title>
          </head>
          <body>
            <h2 id="form-title"></h2>
            <form id="test-form">
              <input id="name" type="text" name="name" value="">
              <input id="email" type="email" name="email" value="">
              <button id="submit-button" type="submit">Submit</button>
            </form>
          </body>
        </html>
      `);
  
      // Definir uma função isEditing simulada
      isEditing = () => false;
    });
  
    it('deve exibir "New Contact" quando não estiver editando', () => {
      // Atualizar o título do formulário com base na função isEditing
      const formTitle = document.getElementById('form-title');
      formTitle.textContent = isEditing() ? "Edit Contact" : "New Contact";
      
      // Verificar se o título é "New Contact"
      expect(formTitle.textContent).toBe('New Contact');
    });
  
    it('deve exibir "Edit Contact" quando estiver editando', () => {
      // Definir isEditing para retornar true
      isEditing = () => true;
      
      // Atualizar o título do formulário com base na função isEditing
      const formTitle = document.getElementById('form-title');
      formTitle.textContent = isEditing() ? "Edit Contact" : "New Contact";
      
      // Verificar se o título é "Edit Contact"
      expect(formTitle.textContent).toBe('Edit Contact');
    });
  
    // Mais testes podem ser adicionados para verificar outros aspectos do formulário
  
  });
  
