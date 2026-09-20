# CONTai — Contexto e Documentação do Projeto

## 1. Identificação do Projeto

Nome: ContAI  
Tipo: Sistema SaaS para gestão de micro e pequenas empresas.  
Objetivo: oferecer uma plataforma simples para apoiar pequenos negócios no controle de informações empresariais, financeiras, estoque, histórico e inteligência artificial.

## 2. Empresa DEMO

- Razão Social: Resolve Já Serviços de Informática Ltda.
- Nome Fantasia: Resolve Já
- CNPJ: 12.345.678/0001-90
- Tipo: Microempresa (ME)
- Segmento: Manutenção e suporte técnico
- Data de Abertura: 10/03/2024
- Descrição: A Resolve Já é uma microempresa especializada em manutenção de computadores, configuração de equipamentos, impressoras e redes, atendendo clientes particulares e pequenos negócios.

Os dados acima são fictícios e utilizados exclusivamente para demonstração e desenvolvimento.

## 3. Contato

- E-mail: contato@resolveja.com.br
- Telefone: (12) 99999-0000
- WhatsApp: (12) 99999-0000
- Site: www.resolveja.com.br

## 4. Endereço

- CEP: 12700-000
- Estado: SP
- Cidade: Cruzeiro
- Bairro: Centro
- Rua: Rua Principal
- Número: 100
- Complemento: Sala 2

## 5. Responsável

- Nome: Carlos Henrique Souza
- CPF: 123.456.789-00
- E-mail: carlos@resolveja.com.br
- Telefone: (12) 99999-0000

O CPF é fictício e utilizado somente para demonstração.

## 6. Acesso DEMO

- E-mail: contato@resolveja.com.br
- Senha: Resolve@2026

Esses dados são apenas para demonstração. Em uma aplicação real, a senha deve ser protegida por backend e hash seguro.

## 7. Estrutura de Arquivos Atual

```text
ContAI/
  HTML/home.html
  css/home.css
  js/home.js
  assets/images/
  assets/icons/
  MarkDown/
```

Os nomes `home.html`, `home.css` e `home.js` refletem os arquivos existentes no projeto no momento desta documentação.

## 8. Cadastro Empresarial

O cadastro existente foi convertido em um fluxo por etapas:

1. Dados da empresa
2. Contato
3. Endereço
4. Responsável
5. Acesso
6. Revisão
7. Confirmação

O formulário usa o modal de cadastro existente, sem criar uma nova tela de login ou duplicar páginas.

## 9. Estrutura de Dados

```javascript
const empresa = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  tipoEmpresa: "",
  segmento: "",
  dataAbertura: "",
  descricao: "",
  contato: {
    email: "",
    telefone: "",
    whatsapp: "",
    site: "",
  },
  endereco: {
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  },
  responsavel: {
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  },
  acesso: {
    email: "",
    senha: "",
  },
};
```

## 10. Armazenamento

A demonstração utiliza `localStorage`:

- Chave de dados: `empresaContAI`
- Indicador: `cadastroConcluido`

O login consulta o e-mail e a senha armazenados. Esta solução é somente para protótipo local; não deve ser usada para produção sem backend e proteção de credenciais.

## 11. Validações e Máscaras

O cadastro valida campos obrigatórios, e-mail, telefone, CEP, CNPJ, CPF, senha, confirmação de senha e força mínima da senha. O CNPJ e o CPF demo possuem exceção explícita para permitir os dados fictícios fornecidos.

Máscaras disponíveis:

- CNPJ: `00.000.000/0000-00`
- CPF: `000.000.000-00`
- CEP: `00000-000`
- Telefone: `(00) 00000-0000`

## 12. Funcionalidades Futuras

- Dashboard
- Financeiro
- Estoque
- Histórico
- Relatórios
- Perfil
- Configurações
- Chat AI
- Inteligência artificial
- Indicadores

Estas funcionalidades não foram implementadas nesta etapa.

## 13. Regras do Projeto

- Preservar telas e funcionalidades existentes.
- Manter a identidade visual ContAI.
- Não utilizar frameworks.
- Não utilizar backend nesta etapa.
- Manter HTML, CSS e JavaScript separados.
- Toda a lógica do cadastro fica no JavaScript existente.
- Usar `addEventListener()` em vez de `onclick` no HTML.
- Consultar e atualizar este documento em alterações importantes.

# Histórico de Alterações

## Versão 1.0

Alterações:

- Criado o cadastro empresarial por etapas.
- Definida a empresa DEMO Resolve Já.
- Adicionadas validações, máscaras e força da senha.
- Criada tela de revisão antes da confirmação.
- Implementado armazenamento com `localStorage`.
- Integrado o login aos dados cadastrados.
- Criado perfil resumido da empresa após o login.
- Criada a documentação inicial do ContAI.

Arquivos modificados:

- `ContAI/HTML/home.html`
- `ContAI/css/home.css`
- `ContAI/js/home.js`
- `CONTEXTO_CONTai.md`

Observações:

- O projeto continua em desenvolvimento.
- Os dados empresariais e as credenciais são fictícios.

## Versão 1.1

Alterações:

-

Arquivos modificados:

-

Observações:

-
