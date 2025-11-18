// js/main.js

// 1. Definição dos templates de conteúdo
// Carrega o conteúdo dos templates definidos no index.html
const pageTemplates = {
    home: document.getElementById('template-home') ? document.getElementById('template-home').content : null,
    sobreNos: document.getElementById('template-sobre-nos') ? document.getElementById('template-sobre-nos').content : null,
    projetos: document.getElementById('template-projetos') ? document.getElementById('template-projetos').content : null,
    cadastro: document.getElementById('template-cadastro') ? document.getElementById('template-cadastro').content : null
};

// Dados de exemplo para os projetos (poderia vir de um JSON, API, etc.)
const projectsData = [
    {
        id: 'edu-futuro',
        image: 'img/projeto-social.png', // Certifique-se de que os caminhos das imagens estão corretos
        alt: 'Crianças estudando em um ambiente escolar',
        title: 'Educação para o Futuro',
        description: 'Iniciativa que oferece reforço escolar e atividades extracurriculares para crianças e jovens em situação de vulnerabilidade.',
        badge: 'Educação',
        buttonText: 'Participar',
        buttonLink: '#cadastro'
    },
    {
        id: 'saude-comunitaria',
        image: 'img/medicos-voluntarios.png',
        alt: 'Voluntários em ação de saúde comunitária',
        title: 'Saúde Comunitária',
        description: 'Programa que leva atendimento médico e odontológico básico, além de campanhas de vacinação, a comunidades carentes.',
        badge: 'Saúde',
        buttonText: 'Doar / Voluntariar',
        buttonLink: '#cadastro'
    },
    {
        id: 'preservacao-ambiental',
        image: 'img/projeto-replantar.png',
        alt: 'Voluntários plantando árvores',
        title: 'Preservação Ambiental',
        description: 'Projetos de reflorestamento, limpeza de rios e conscientização sobre a importância da sustentabilidade e ecologia local.',
        badge: 'Meio Ambiente',
        buttonText: 'Junte-se a Nós',
        buttonLink: '#cadastro'
    },
];


// 2. Função para renderizar uma página/seção
function renderPage(pageName) {
    const mainContent = document.getElementById('app-main'); 
    
    if (!mainContent) {
        console.error("Elemento 'main' com ID 'app-main' não encontrado. Verifique seu index.html.");
        return;
    }

    const templateContent = pageTemplates[pageName];

    if (templateContent) {
        // Limpa o conteúdo atual
        mainContent.innerHTML = ''; 
        // Adiciona o conteúdo do template clonado
        mainContent.appendChild(templateContent.cloneNode(true)); 

        // Opcional: chamar funções específicas para cada página após renderização
        if (pageName === 'projetos') {
            renderProjectCards(projectsData); // Renderiza os cards de projeto dinamicamente
        }
        if (pageName === 'cadastro') {
            setupFormValidation(); // Adiciona validação ao formulário
        }
        
    } else {
        mainContent.innerHTML = '<h1>Página não encontrada</h1><p>Desculpe, a página que você procura não existe ou o template não foi carregado corretamente.</p>';
        console.error(`Template para a página '${pageName}' não encontrado ou vazio.`);
    }
}

// 3. Gerenciamento de Rotas (SPA)
function handleNavigation() {
    const hash = window.location.hash.substring(1); // Pega a parte da URL após o #
    // Mapeamento de rotas para templates
    const routes = {
        '': 'home', // Rota padrão (para index.html ou #)
        'home': 'home',
        'sobre-nos': 'sobreNos', 
        'projetos': 'projetos',
        'cadastro': 'cadastro'
    };
    renderPage(routes[hash] || 'home'); // Renderiza a página correspondente ou a home
}

// Escutar mudanças na URL (para botões de voltar/avançar do navegador)
window.addEventListener('hashchange', handleNavigation);

// Escutar cliques nos links de navegação e botões com links internos
document.addEventListener('click', (e) => {
    // Verifica se o clique foi em um link de navegação ou botão com link de hash
    // Isso inclui links dentro da <nav> e botões como "Conheça Nossos Projetos"
    const target = e.target.closest('a[href^="#"], button.btn[href^="#"]'); 

    if (target) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault(); // Previne o comportamento padrão (recarregar a página)
            window.location.hash = href.substring(1); // Atualiza a hash na URL

            // Se for um menu hamburguer, fechar após o clique
            const navUl = document.querySelector('nav ul');
            if (navUl && navUl.classList.contains('nav-open')) {
                navUl.classList.remove('nav-open');
            }
        }
    }
});

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    handleNavigation(); // Renderiza a página inicial baseada na hash (ou home)
    setupHamburgerMenu(); // Inicializa o menu hamburguer
});


// 4. Implementação da Validação de Formulários (para a página de cadastro)
function setupFormValidation() {
    const form = document.getElementById('volunteer-form');
    if (!form) return; // Garante que o formulário existe na página atual

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário
        let isValid = true;

        // Validação do campo Nome Completo
        const nameInput = form.querySelector('#nome');
        if (nameInput) { // Verifica se o elemento existe
            if (nameInput.value.trim().length < 3) {
                displayError(nameInput, 'O nome deve ter pelo menos 3 caracteres.');
                isValid = false;
            } else {
                clearError(nameInput);
            }
        }

        // Validação do campo E-mail
        const emailInput = form.querySelector('#email');
        if (emailInput) {
            if (!isValidEmail(emailInput.value)) {
                displayError(emailInput, 'Por favor, insira um e-mail válido.');
                isValid = false;
            } else {
                clearError(emailInput);
            }
        }

        // Validação do campo Telefone
        const phoneInput = form.querySelector('#telefone');
        if (phoneInput) {
            // Regex para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
            // Remove qualquer coisa que não seja dígito para validar
            const cleanPhone = phoneInput.value.replace(/\D/g, ''); 
            if (!/^\d{10,11}$/.test(cleanPhone)) { // 10 ou 11 dígitos
                displayError(phoneInput, 'Por favor, insira um telefone válido (10 ou 11 dígitos, com DDD).');
                isValid = false;
            } else {
                clearError(phoneInput);
            }
        }

        // Validação do campo Data de Nascimento
        const dobInput = form.querySelector('#dataNascimento');
        if (dobInput) {
            if (!isValidDateOfBirth(dobInput.value)) {
                displayError(dobInput, 'Data de nascimento inválida ou você deve ter pelo menos 18 anos.');
                isValid = false;
            } else {
                clearError(dobInput);
            }
        }

        // Validação do campo Gênero
        const generoInput = form.querySelector('#genero');
        if (generoInput) {
            if (generoInput.value === '') {
                displayError(generoInput, 'Por favor, selecione seu gênero.');
                isValid = false;
            } else {
                clearError(generoInput);
            }
        }

        // Validação do campo Área de Interesse
        const interesseInput = form.querySelector('#interesse');
        if (interesseInput) {
            if (interesseInput.value === '') {
                displayError(interesseInput, 'Por favor, selecione uma área de interesse.');
                isValid = false;
            } else {
                clearError(interesseInput);
            }
        }

        // Validação dos Termos de Uso
        const termosCheckbox = form.querySelector('#termos');
        if (termosCheckbox) {
            if (!termosCheckbox.checked) {
                displayError(termosCheckbox, 'Você deve concordar com os termos de uso.');
                isValid = false;
            } else {
                clearError(termosCheckbox);
            }
        }

        // Se tudo estiver válido, processa o formulário
        if (isValid) {
            // Exemplo: Salvar dados no Local Storage
            const formData = {
                nome: nameInput ? nameInput.value : '',
                email: emailInput ? emailInput.value : '',
                telefone: phoneInput ? phoneInput.value : '',
                dataNascimento: dobInput ? dobInput.value : '',
                genero: generoInput ? generoInput.value : '',
                interesse: interesseInput ? interesseInput.value : '',
                mensagem: form.querySelector('#mensagem') ? form.querySelector('#mensagem').value : ''
            };
            saveFormDataToLocalStorage(formData);
            
            alert('Formulário enviado com sucesso! Seus dados foram salvos localmente.');
            form.reset(); // Limpa o formulário
            // Opcional: Redirecionar para uma página de sucesso ou exibir modal
        } else {
            alert('Por favor, corrija os erros no formulário antes de enviar.');
        }
    });

    // Função auxiliar para exibir mensagem de erro
    function displayError(inputElement, message) {
        const parent = inputElement.parentElement;
        let errorSpan = parent.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error-message');
            parent.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        inputElement.classList.add('is-invalid'); // Adiciona classe para estilização CSS
    }

    // Função auxiliar para limpar mensagem de erro
    function clearError(inputElement) {
        const parent = inputElement.parentElement;
        const errorSpan = parent.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.remove();
        }
        inputElement.classList.remove('is-invalid');
    }

    // Funções de validação específicas
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidDateOfBirth(dateString) {
        if (!dateString) return false;
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18; // Requer idade mínima de 18 anos
    }

    // Exemplo: Salvar dados do formulário no Local Storage
    function saveFormDataToLocalStorage(data) {
        let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        registrations.push(data);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        console.log('Dados do formulário salvos no Local Storage:', data);
    }
}


// 5. Funções para o menu hamburguer
function setupHamburgerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navUl = document.querySelector('nav ul');

    if (hamburgerBtn && navUl) {
        hamburgerBtn.addEventListener('click', () => {
            navUl.classList.toggle('nav-open');
        });
    }
}


// 6. Funções para renderizar cards de projetos
function renderProjectCards(projects) {
    const projectGrid = document.querySelector('#projetos-list .projects-grid'); // Use .projects-grid
    if (!projectGrid) {
        console.error("Elemento 'div.projects-grid' dentro de '#projetos-list' não encontrado.");
        return;
    }

    projectGrid.innerHTML = ''; // Limpa o grid antes de renderizar
    
    projects.forEach(project => {
        const cardHtml = `
            <article class="card col-sm-12 col-md-6 col-lg-4">
                <img src="${project.image}" alt="${project.alt}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-description">${project.description}</p>
                    <div class="flex-group">
                        <span class="badge badge-primary">${project.badge}</span>
                    </div>
                    <a href="${project.buttonLink}" class="btn btn-primary">${project.buttonText}</a>
                </div>
            </article>
        `;
        projectGrid.innerHTML += cardHtml;
    });
}