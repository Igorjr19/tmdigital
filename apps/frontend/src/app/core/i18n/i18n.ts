import { LeadDto } from '../../api';

export const I18N = {
  COMMON: {
    APP_NAME: 'TMDigital',
    COPYRIGHT: 'TMDigital © 2026',
    ACTIONS: 'Ações',
    YES: 'Sim',
    NO: 'Não',
    CANCEL: 'Cancelar',
    SAVE: 'Salvar',
    EDIT: 'Editar',
    DELETE: 'Excluir',
    CLOSE: 'Fechar',
    BACK: 'Voltar',
    SEARCH: 'Buscar por nome, CPF/CNPJ',
    LOADING: 'Carregando...',
    SUCCESS: 'Sucesso',
    ERROR: 'Erro',
    CONFIRM_DELETE_TITLE: 'Confirmar Exclusão',
    CONFIRM_DELETE_MSG: (name: string) =>
      `Tem certeza que deseja excluir o lead ${name}?`,
  },
  MENU: {
    LEADS: 'Leads',
    DASHBOARD: 'Dashboard',
    MAP: 'Mapa',
  },
  LEAD: {
    STATUS: {
      [LeadDto.StatusEnum.New]: 'Novo',
      [LeadDto.StatusEnum.Contacted]: 'Contatado',
      [LeadDto.StatusEnum.Qualified]: 'Qualificado',
      [LeadDto.StatusEnum.Converted]: 'Convertido',
      [LeadDto.StatusEnum.Lost]: 'Perdido',
    },
    LIST: {
      TITLE: 'Leads',
      NEW_LEAD: 'Novo Lead',
      HEADERS: {
        NAME: 'Nome',
        DOCUMENT: 'CPF/CNPJ',
        STATUS: 'Status',
        AREA: 'Área',
        POTENTIAL: 'Potencial',
      },
      EMPTY: 'Nenhum lead encontrado.',
      DELETE_SUCCESS: 'Lead excluído com sucesso',
      DELETE_ERROR: 'Erro ao excluir lead',
    },
    FORM: {
      TITLE_NEW: 'Novo Lead',
      TITLE_EDIT: 'Editar Lead',
      LABELS: {
        NAME: 'Nome',
        DOCUMENT: 'CPF/CNPJ',
        STATUS: 'Status',
        POTENTIAL: 'Potencial (R$)',
        CURRENT_SUPPLIER: 'Fornecedor Atual',
        NOTES: 'Observações',
      },
      PLACEHOLDERS: {
        NAME: 'Nome do Lead',
        DOCUMENT: 'CPF/CNPJ',
        SELECT: 'Selecione...',
        POTENTIAL: 'R$ 0,00',
        CURRENT_SUPPLIER: 'Ex: Concorrente X',
        NOTES: 'Observações adicionais...',
      },
      VALIDATION: {
        REQUIRED: 'é obrigatório.',
      },
      SUCCESS_CREATE: 'Lead criado!',
      ERROR_CREATE: 'Erro ao criar lead.',
      SUCCESS_UPDATE: 'Lead atualizado!',
      ERROR_UPDATE: 'Erro ao atualizar lead.',
      NOT_FOUND: 'Lead não encontrado.',
    },
    DETAIL: {
      TITLE: 'Detalhes do Lead',
      SECTIONS: {
        PROPERTIES: 'Propriedades',
      },
      NO_NOTES: 'Nenhuma observação.',
    },
    MAP: {
      POPUP: {
        NAME: 'Nome da Propriedade',
        CULTURE: 'Cultura',
        STATUS: 'Status',
        DETAILS: 'Ver Detalhes',
        ESTIMATED: 'Soja/Milho (Est.)',
        NA: 'N/A',
      },
    },
    PROPERTIES: {
      TITLE: 'Propriedades Rurais',
      ADD: 'Adicionar Propriedade',
      HEADERS: {
        NAME: 'Nome',
        AREA: 'Área (ha)',
        ACTIONS: 'Ações',
      },
      EMPTY: 'Nenhuma propriedade cadastrada.',
      DIALOG_TITLE: 'Nova Propriedade',
      NAME_LABEL: 'Nome da Propriedade',
      AREA_LABEL: 'Área (Hectares)',
      LATITUDE: 'Latitude',
      LONGITUDE: 'Longitude',
    },
  },
  DASHBOARD: {
    KPI: {
      TOTAL_LEADS: 'Total de Leads',
      ACTIVE_LEADS: 'Leads Ativos',
      CONVERTED_LEADS: 'Leads Convertidos',
      ESTIMATED_POTENTIAL: 'Potencial Estimado',
    },
    CHARTS: {
      LEADS_BY_STATUS: 'Leads por Status',
      LEADS_EVOLUTION: 'Evolução de Leads',
    },
  },
};
