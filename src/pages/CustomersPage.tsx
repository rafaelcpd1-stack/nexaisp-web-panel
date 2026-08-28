import {
  Building2,
  ChevronDown,
  Plus,
  RefreshCw,
  Search,
  User,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCustomers, type Customer } from "../api/customers";
import "../App.css";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCustomerType(type: Customer["type"]): string {
  if (type === "company") {
    return "Pessoa jurídica";
  }

  if (type === "individual") {
    return "Pessoa física";
  }

  return type;
}

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

function formatStatus(status: string): string {
  const normalized = normalizeStatus(status);

  if (normalized === "active" || normalized === "ativo") {
    return "Ativo";
  }

  if (normalized === "inactive" || normalized === "inativo") {
    return "Inativo";
  }

  if (normalized === "blocked" || normalized === "bloqueado") {
    return "Bloqueado";
  }

  return status;
}

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadCustomers(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getCustomers();

      setCustomers(response.customers);
      setTotal(response.total);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar os clientes.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        query === "" ||
        customer.name.toLowerCase().includes(query) ||
        customer.document_number.toLowerCase().includes(query);

      const normalizedStatus = normalizeStatus(customer.status);

      const matchesStatus =
        statusFilter === "all" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  return (
      <div className="page-content customers-page">
          <section className="page-heading customers-heading">
            <div>
              <span className="page-kicker">GESTÃO DE CLIENTES</span>
              <h1>Clientes</h1>
              <p>
                Consulte e acompanhe os clientes cadastrados no NexaISP.
              </p>
            </div>

            <button type="button" className="primary-button">
              <Plus size={18} />
              Novo cliente
            </button>
          </section>

          <section className="customer-summary-grid">
            <article className="customer-summary-card">
              <div className="customer-summary-icon blue">
                <Users size={20} />
              </div>

              <div>
                <span>Total de clientes</span>
                <strong>{loading ? "—" : total.toLocaleString("pt-BR")}</strong>
              </div>
            </article>

            <article className="customer-summary-card">
              <div className="customer-summary-icon green">
                <User size={20} />
              </div>

              <div>
                <span>Ativos</span>
                <strong>
                  {loading
                    ? "—"
                    : customers
                        .filter(
                          (customer) =>
                            normalizeStatus(customer.status) === "active" ||
                            normalizeStatus(customer.status) === "ativo",
                        )
                        .length.toLocaleString("pt-BR")}
                </strong>
              </div>
            </article>

            <article className="customer-summary-card">
              <div className="customer-summary-icon purple">
                <Building2 size={20} />
              </div>

              <div>
                <span>Pessoa jurídica</span>
                <strong>
                  {loading
                    ? "—"
                    : customers
                        .filter((customer) => customer.type === "company")
                        .length.toLocaleString("pt-BR")}
                </strong>
              </div>
            </article>
          </section>

          <section className="panel customers-panel">
            <div className="panel-header customers-toolbar">
              <div>
                <h2>Base de clientes</h2>
                <span>
                  {loading
                    ? "Carregando..."
                    : `${filteredCustomers.length.toLocaleString(
                        "pt-BR",
                      )} cliente(s) exibido(s)`}
                </span>
              </div>

              <div className="customers-filters">
                <div className="customer-search">
                  <Search size={15} />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar cliente..."
                    aria-label="Buscar cliente"
                  />
                </div>

                <button
                  type="button"
                  className="customer-refresh-button"
                  onClick={() => void loadCustomers(true)}
                  disabled={refreshing}
                  title="Atualizar clientes"
                  aria-label="Atualizar clientes"
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "spin" : ""}
                  />
                </button>

                <div className="customer-filter">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filtrar por status"
                  >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="blocked">Bloqueados</option>
                  </select>

                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {error && (
              <div className="dashboard-api-error">
                <strong>Não foi possível carregar os clientes.</strong>
                <span>{error}</span>

                <button
                  type="button"
                  onClick={() => void loadCustomers()}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {loading ? (
              <div className="customer-loading">
                <RefreshCw size={22} className="spin" />
                <span>Carregando clientes do Core...</span>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="dashboard-empty-state customers-empty">
                <Users size={30} />
                <strong>Nenhum cliente encontrado.</strong>
                <span>
                  {customers.length === 0
                    ? "O Core não retornou clientes."
                    : "Tente alterar a pesquisa ou o filtro."}
                </span>
              </div>
            ) : (
              <div className="customers-table-wrapper">
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>CLIENTE</th>
                      <th>TIPO</th>
                      <th>DOCUMENTO</th>
                      <th>STATUS</th>
                      <th>CADASTRO</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <div className="customer-name-cell">
                            <div className="customer-avatar">
                              {customer.name
                                .trim()
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>{customer.name}</strong>
                              <span>{customer.id}</span>
                            </div>
                          </div>
                        </td>

                        <td>{formatCustomerType(customer.type)}</td>

                        <td>
                          <span className="customer-document">
                            {customer.document_number || "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${normalizeStatus(
                              customer.status,
                            )}`}
                          >
                            <i />
                            {formatStatus(customer.status)}
                          </span>
                        </td>

                        <td>{formatDate(customer.created_at)}</td>

                        <td>
                          <button
                            type="button"
                            className="table-action-button"
                            title="Detalhes do cliente"
                            aria-label={`Detalhes de ${customer.name}`}
                          >
                            <ChevronDown size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
  );
}

export default CustomersPage;
