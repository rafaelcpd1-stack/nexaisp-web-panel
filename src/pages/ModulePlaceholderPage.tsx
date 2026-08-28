import {
  Activity,
  ArrowRight,
  Database,
  FileText,
  Gauge,
  Package,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import "../App.css";

const moduleMap: Record<
  string,
  {
    icon: React.ElementType;
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  "/contratos": {
    icon: FileText,
    eyebrow: "GESTÃO DE CONTRATOS",
    title: "Contratos",
    description: "Gestão de contratos e vínculos dos clientes.",
  },
  "/planos": {
    icon: Package,
    eyebrow: "CATÁLOGO COMERCIAL",
    title: "Planos",
    description: "Planos de internet, velocidades e condições comerciais.",
  },
  "/financeiro": {
    icon: Gauge,
    eyebrow: "GESTÃO FINANCEIRA",
    title: "Financeiro",
    description: "Receitas, cobranças, pagamentos e valores em aberto.",
  },
  "/atendimentos": {
    icon: Activity,
    eyebrow: "OPERAÇÃO",
    title: "Atendimentos",
    description: "Central de atendimentos e acompanhamento operacional.",
  },
  "/ordens-servico": {
    icon: Wrench,
    eyebrow: "OPERAÇÃO DE CAMPO",
    title: "Ordens de Serviço",
    description: "Ordens de serviço e execução técnica.",
  },
  "/dispositivos": {
    icon: Activity,
    eyebrow: "INFRAESTRUTURA",
    title: "Dispositivos",
    description: "Equipamentos e ativos da infraestrutura do provedor.",
  },
  "/olt-onu": {
    icon: Activity,
    eyebrow: "REDE ÓPTICA",
    title: "OLT / ONU",
    description: "Gestão da rede óptica e terminais dos clientes.",
  },
  "/radius": {
    icon: ShieldCheck,
    eyebrow: "AUTENTICAÇÃO",
    title: "RADIUS",
    description: "Autenticação, sessões e infraestrutura AAA.",
  },
  "/ipam": {
    icon: Database,
    eyebrow: "REDE",
    title: "IPAM",
    description: "Endereçamento IP e organização da rede.",
  },
  "/monitoramento": {
    icon: Activity,
    eyebrow: "OBSERVABILIDADE",
    title: "Monitoramento",
    description: "Saúde da rede, disponibilidade e alertas.",
  },
  "/estoque": {
    icon: Package,
    eyebrow: "SUPRIMENTOS",
    title: "Estoque",
    description: "Equipamentos, materiais e movimentações.",
  },
  "/fiscal": {
    icon: FileText,
    eyebrow: "FISCAL",
    title: "Fiscal",
    description: "Documentos e processos fiscais.",
  },
  "/relatorios": {
    icon: FileText,
    eyebrow: "ANÁLISES",
    title: "Relatórios",
    description: "Relatórios operacionais e gerenciais.",
  },
  "/configuracoes": {
    icon: Settings,
    eyebrow: "SISTEMA",
    title: "Configurações",
    description: "Configurações gerais do NexaISP.",
  },
};

export default function ModulePlaceholderPage() {
  const location = useLocation();

  const module =
    moduleMap[location.pathname] ?? {
      icon: Gauge,
      eyebrow: "NEXAISP",
      title: "Módulo",
      description: "Módulo do NexaISP.",
    };

  const Icon = module.icon;

  return (
    <div className="page-content module-page">
      <section className="page-heading module-heading">
        <div>
          <span className="page-kicker">{module.eyebrow}</span>
          <h1>{module.title}</h1>
          <p>{module.description}</p>
        </div>
      </section>

      <section className="dashboard-grid module-grid">
        <article className="panel module-hero-card">
          <div className="module-icon">
            <Icon size={26} />
          </div>

          <div>
            <span className="module-card-kicker">MÓDULO</span>
            <h2>{module.title}</h2>
            <p>
              Esta área já está integrada ao shell do NexaISP.
              O conteúdo operacional será implementado neste módulo.
            </p>
          </div>

          <div className="module-status">
            <span className="module-status-dot" />
            Estrutura pronta
          </div>
        </article>

        <article className="panel module-info-card">
          <div className="panel-header">
            <h2>Próximas etapas</h2>
          </div>

          <div className="module-info-content">
            <div>
              <strong>API</strong>
              <span>Integração com o Core</span>
            </div>

            <div>
              <strong>Interface</strong>
              <span>Padrão visual NexaISP</span>
            </div>

            <div>
              <strong>Operação</strong>
              <span>Dados reais do módulo</span>
            </div>
          </div>

          <button type="button" className="panel-action">
            Preparar módulo
            <ArrowRight size={16} />
          </button>
        </article>
      </section>
    </div>
  );
}
