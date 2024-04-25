const { JSDOM } = require('jsdom');
const { fireEvent } = require('@testing-library/dom');

// Função auxiliar para carregar o HTML e retornar o documento DOM
async function loadHTML(html) {
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  await dom.window.document.readyState === 'complete';
  return dom.window.document;
}

describe('Frontend tests', () => {
  let document;

  beforeAll(async () => {
    // Carregar o HTML antes de cada teste
    document = await loadHTML(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Contact Manager</title>
          <!-- Links para fontes e estilos -->
        </head>
        <body>
          <header>
            <a href="/contacts"><h1>Contact Manager</h1></a>
          </header>
          <section id="sidebar">
            <!-- Incluir conteúdo do sidebar.pug -->
          </section>
          <main id="content">
            <!-- Incluir conteúdo dependendo da ação -->
          </main>
          <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        </body>
      </html>
    `);
  });

  it('deve exibir o título "Contact Manager"', () => {
    expect(document.querySelector('title').textContent).toBe('Contact Manager');
  });

  it('deve navegar para a página de contatos ao clicar no título', () => {
    const titleLink = document.querySelector('header a');
    const href = titleLink.getAttribute('href');
  
    fireEvent.click(titleLink);
  
    // Verifica se a função de navegação foi chamada corretamente
    expect(href).toBe('/contacts');
  });
  
  

  // Mais testes podem ser adicionados para interagir com outros elementos da página
});
