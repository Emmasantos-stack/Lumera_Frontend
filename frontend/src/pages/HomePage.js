import { useState } from 'react';
import { SimpleDialog } from '../components/SharedComponents';
import logo from '../assets/logo-cyberbox.png';

const HOMEPAGE_DEFAULTS = {
  title: 'Cibersegurança para organizações que não podem parar',
  description: 'Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos. Apoiamos empresas e entidades públicas na redução do risco cibernético, no cumprimento de requisitos regulatórios, incluindo a Diretiva Europeia NIS2, e no reforço da sua postura de segurança.',
};

export default function HomeScreen({ onOpenLogin }) {
  const [showNis2, setShowNis2] = useState(false);
  const homepageTitle = localStorage.getItem('hp_title') || HOMEPAGE_DEFAULTS.title;
  const homepageDesc = localStorage.getItem('hp_desc') || HOMEPAGE_DEFAULTS.description;

  const servicosNis2 = [
    'Análise de enquadramento da entidade',
    'Avaliação de maturidade de cibersegurança',
    'Análise e gestão de risco',
    'Definição de políticas e procedimentos',
    'Implementação de controlos técnicos e organizacionais',
    'Apoio à gestão e comunicação de incidentes',
  ];

  return (
    <div className="min-vh-100 bg-white">
      <div className="topbar py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3 text-white">
            <img src={logo} alt="CyberBoxSecurity" width="56" height="56" />
            <h1 className="h3 m-0">CyberBoxSecurity</h1>
          </div>
          <button className="btn btn-primary px-4 py-2" onClick={onOpenLogin}>ENTRAR</button>
        </div>
      </div>

      <div className="container py-5">
        <section className="mb-5 pb-4 border-bottom">
          <h2 className="hero-title fw-bold mb-4">{homepageTitle}</h2>
          <p className="text-secondary fs-5">{homepageDesc}</p>
        </section>

        <section className="mb-5">
          <h3 className="section-title mb-3">O contexto atual</h3>
          <p className="text-secondary mb-3">A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas.</p>
          <div className="row g-3 mb-4">
            <div className="col-md-6"><div className="context-chip p-3">Ataques de ransomware</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Exploração de vulnerabilidades</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Ataques a infraestruturas críticas</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Campanhas de phishing direcionado</div></div>
          </div>
          <div className="context-note p-4 text-secondary">
            Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional,
            existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança.
          </div>
        </section>

        <hr className="my-5" />

        <section className="mb-5">
          <h3 className="section-title mb-3">Regulamentação Europeia</h3>
          <p className="text-secondary mb-3">
            A União Europeia reforçou os requisitos de segurança através da diretiva <strong className="text-dark">NIS2 - Network and Information Security Directive</strong>.
          </p>
          <div className="row g-3">
            <div className="col-md-4"><div className="context-chip p-3 text-center">Sanções financeiras significativas</div></div>
            <div className="col-md-4"><div className="context-chip p-3 text-center">Responsabilidade da gestão</div></div>
            <div className="col-md-4"><div className="context-chip p-3 text-center">Impacto reputacional</div></div>
          </div>
        </section>

        <hr className="my-5" />

        <section className="mb-5">
          <h3 className="section-title mb-3">Como ajudamos</h3>
          <div className="row g-3">
            <div className="col-md-6"><div className="context-chip p-3">Avaliação de maturidade de cibersegurança</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Implementação de requisitos da diretiva NIS2</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Auditorias de segurança e testes técnicos</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Programas de formação e security awareness</div></div>
          </div>
        </section>

        <hr className="my-5" />

        <section className="mb-5">
          <h3 className="section-title mb-4">Serviços</h3>
          <div className="context-chip p-4 mb-4">
            <h4 className="h5">Implementação da Diretiva NIS2</h4>
            <div className="row g-2">
              {servicosNis2.map((item) => <div className="col-md-6" key={item}>- {item}</div>)}
            </div>
          </div>
          <div className="text-center mb-4">
            <button className="btn btn-primary px-4" onClick={() => setShowNis2(true)}>NIS2 em Portugal - Saiba Mais</button>
          </div>
        </section>
      </div>

      <section className="topbar py-5">
        <div className="container text-white">
          <h3 className="h2">Contactos</h3>
          <p className="mb-0">
            Se pretende avaliar o nível de segurança da sua organização ou preparar-se para os requisitos da Diretiva NIS2, entre em contacto connosco
            para uma avaliação inicial de maturidade de cibersegurança.
          </p>
        </div>
      </section>

      <SimpleDialog
        show={showNis2}
        title="NIS2 em Portugal"
        description="Diretiva Europeia de Cibersegurança"
        onClose={() => setShowNis2(false)}
        size="modal-dialog modal-lg"
      >
        <div className="d-grid gap-3">
          <div className="detail-box">
            <div className="small text-muted">O que é a NIS2</div>
            <div>A NIS2 reforça a cibersegurança e a resiliência digital das organizações essenciais e importantes.</div>
          </div>
          <div className="detail-box">
            <div className="small text-muted">Em Portugal</div>
            <div>Transposta pelo Decreto-Lei n.º 125/2025, com supervisão do CNCS.</div>
          </div>
          <div className="detail-box">
            <div className="small text-muted">Sanções</div>
            <div>Até 10 milhões de euros ou 2% do volume de negócios para entidades essenciais.</div>
          </div>
        </div>
      </SimpleDialog>
    </div>
  );
}
