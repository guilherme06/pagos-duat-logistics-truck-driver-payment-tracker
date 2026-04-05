export type Language = 'es' | 'pt' | 'en';

export interface Translations {
  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  register: string;
  confirm: string;
  close: string;
  
  // Login & Setup
  loginTitle: string;
  loginSubtitle: string;
  loginButton: string;
  setupTitle: string;
  setupSubtitle: string;
  setupNameLabel: string;
  setupNamePlaceholder: string;
  setupCompanyLabel: string;
  setupCompanyPlaceholder: string;
  setupSalaryLabel: string;
  setupSalaryPlaceholder: string;
  setupMonthlyGoalLabel: string;
  setupMonthlyGoalPlaceholder: string;
  setupMonthlyGoalHelp: string;
  setupCreateButton: string;
  
  // Header
  paymentSystem: string;
  professionalDriver: string;
  logout: string;
  
  // Navigation
  overview: string;
  categories: string;
  trips: string;
  others: string;
  history: string;
  settings: string;
  
  // Monthly Overview
  monthlyOverviewTitle: string;
  monthlyOverviewSubtitle: string;
  totalEarnings: string;
  monthlySalary: string;
  tripsEarnings: string;
  othersEarnings: string;
  categoryBreakdown: string;
  
  // Trip Categories
  tripCategoriesTitle: string;
  tripCategoriesSubtitle: string;
  newCategoryButton: string;
  newCategoryTitle: string;
  newCategorySubtitle: string;
  categoryNameLabel: string;
  categoryNamePlaceholder: string;
  defaultAmountLabel: string;
  defaultAmountPlaceholder: string;
  editCategoryTitle: string;
  deleteCategoryTitle: string;
  deleteCategoryMessage: string;
  noCategoriesTitle: string;
  noCategoriesMessage: string;
  
  // Trip Logging
  tripLoggingTitle: string;
  tripLoggingSubtitle: string;
  newTripButton: string;
  newTripTitle: string;
  newTripSubtitle: string;
  tripDateLabel: string;
  tripCategoryLabel: string;
  selectCategoryPlaceholder: string;
  tripAmountLabel: string;
  tripAmountPlaceholder: string;
  recentTripsTitle: string;
  noTripsTitle: string;
  noTripsMessage: string;
  deleteTripTitle: string;
  deleteTripMessage: string;
  editTripTitle: string;
  editTripSubtitle: string;
  tripUpdated: string;
  tripUpdateError: string;
  
  // Others Section
  othersTitle: string;
  othersSubtitle: string;
  newEntryTitle: string;
  newEntrySubtitle: string;
  entryDateLabel: string;
  entryTypeLabel: string;
  credit: string;
  debt: string;
  entryTypeHelp: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  amountLabel: string;
  amountPlaceholder: string;
  amountHelp: string;
  allEntriesTitle: string;
  allEntriesSubtitle: string;
  noEntriesTitle: string;
  noEntriesMessage: string;
  deleteEntryTitle: string;
  deleteEntryMessage: string;
  editEntryTitle: string;
  editEntrySubtitle: string;
  entryUpdated: string;
  entryUpdateError: string;
  
  // History
  historyTitle: string;
  historySubtitle: string;
  filterByMonth: string;
  exportData: string;
  generateSummaryImage: string;
  summaryImageGenerated: string;
  summaryImageError: string;
  downloadImage: string;
  shareImage: string;
  monthlySummaryTitle: string;
  monthlySummarySubtitle: string;
  tripsByCategory: string;
  extrasTotal: string;
  expensesTotal: string;
  noDataForPeriod: string;
  
  // Profile Settings
  profileTitle: string;
  profileSubtitle: string;
  editProfileButton: string;
  saveChangesButton: string;
  nameLabel: string;
  companyNameLabel: string;
  salaryLabel: string;
  monthlyGoalLabel: string;
  annualGoalLabel: string;
  languageLabel: string;
  
  // Validation Messages
  nameRequired: string;
  companyNameRequired: string;
  salaryPositive: string;
  monthlyGoalPositive: string;
  descriptionRequired: string;
  amountRequired: string;
  
  // Success Messages
  profileUpdated: string;
  categoryCreated: string;
  categoryUpdated: string;
  categoryDeleted: string;
  tripRegistered: string;
  tripDeleted: string;
  entryRegistered: string;
  entryDeleted: string;
  
  // Error Messages
  profileUpdateError: string;
  categoryCreateError: string;
  categoryUpdateError: string;
  categoryDeleteError: string;
  tripRegisterError: string;
  tripDeleteError: string;
  entryRegisterError: string;
  entryDeleteError: string;
  
  // Footer
  builtWith: string;
  using: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    register: 'Registrar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    
    // Login & Setup
    loginTitle: 'Sistema de Pagos',
    loginSubtitle: 'Inicia sesión para acceder a tu panel de control',
    loginButton: 'Iniciar Sesión',
    setupTitle: 'Nombre de tu empresa',
    setupSubtitle: 'Configura tu perfil para comenzar a usar la aplicación',
    setupNameLabel: 'Tu nombre completo',
    setupNamePlaceholder: 'ej. Juan Pérez',
    setupCompanyLabel: 'Nombre de tu empresa',
    setupCompanyPlaceholder: 'ej. Transportes García',
    setupSalaryLabel: 'Salario mensual fijo',
    setupSalaryPlaceholder: '2500.00',
    setupMonthlyGoalLabel: 'Objetivo mensual',
    setupMonthlyGoalPlaceholder: '3000.00',
    setupMonthlyGoalHelp: 'Meta financiera que deseas alcanzar cada mes',
    setupCreateButton: 'Crear Perfil',
    
    // Header
    paymentSystem: 'Sistema de Pagos',
    professionalDriver: 'Conductor Profesional',
    logout: 'Cerrar sesión',
    
    // Navigation
    overview: 'Resumen',
    categories: 'Categorías',
    trips: 'Viajes',
    others: 'Otros',
    history: 'Historial',
    settings: 'Ajustes',
    
    // Monthly Overview
    monthlyOverviewTitle: 'Resumen Mensual',
    monthlyOverviewSubtitle: 'Visión general de tus ingresos del mes actual',
    totalEarnings: 'Ingresos Totales',
    monthlySalary: 'Salario Mensual',
    tripsEarnings: 'Ingresos por Viajes',
    othersEarnings: 'Otros Ingresos',
    categoryBreakdown: 'Desglose por Categoría',
    
    // Trip Categories
    tripCategoriesTitle: 'Categorías de Viajes',
    tripCategoriesSubtitle: 'Gestiona las categorías reutilizables para tus viajes',
    newCategoryButton: 'Nueva Categoría',
    newCategoryTitle: 'Nueva Categoría',
    newCategorySubtitle: 'Crea una nueva categoría de viaje con importe por defecto',
    categoryNameLabel: 'Nombre de la categoría',
    categoryNamePlaceholder: 'ej. Francia, Lidl, Mercadona...',
    defaultAmountLabel: 'Importe por defecto',
    defaultAmountPlaceholder: '150.00',
    editCategoryTitle: 'Editar Categoría',
    deleteCategoryTitle: '¿Eliminar categoría?',
    deleteCategoryMessage: 'Esta acción no se puede deshacer. Se eliminará la categoría permanentemente.',
    noCategoriesTitle: 'No hay categorías creadas',
    noCategoriesMessage: 'Crea tu primera categoría para organizar mejor tus viajes',
    
    // Trip Logging
    tripLoggingTitle: 'Registro de Viajes',
    tripLoggingSubtitle: 'Registra tus viajes y calcula automáticamente tus ingresos',
    newTripButton: 'Nuevo Viaje',
    newTripTitle: 'Nuevo Viaje',
    newTripSubtitle: 'Registra un nuevo viaje con fecha y categoría personalizada',
    tripDateLabel: 'Fecha del viaje',
    tripCategoryLabel: 'Categoría',
    selectCategoryPlaceholder: 'Selecciona una categoría',
    tripAmountLabel: 'Importe',
    tripAmountPlaceholder: '150.00',
    recentTripsTitle: 'Viajes Recientes',
    noTripsTitle: 'No hay viajes registrados',
    noTripsMessage: 'Registra tu primer viaje usando el formulario de arriba',
    deleteTripTitle: '¿Eliminar viaje?',
    deleteTripMessage: 'Esta acción no se puede deshacer. Se eliminará el viaje permanentemente.',
    editTripTitle: 'Editar Viaje',
    editTripSubtitle: 'Modifica los datos del viaje seleccionado',
    tripUpdated: 'Viaje actualizado exitosamente',
    tripUpdateError: 'Error al actualizar el viaje',
    
    // Others Section
    othersTitle: 'Otros Ingresos y Gastos',
    othersSubtitle: 'Gestiona ingresos adicionales y gastos sin límite de cantidad',
    newEntryTitle: 'Nueva Entrada',
    newEntrySubtitle: 'Registra tantos ingresos adicionales o gastos como necesites con fecha personalizada',
    entryDateLabel: 'Fecha',
    entryTypeLabel: 'Tipo de entrada',
    credit: 'Crédito',
    debt: 'Deuda',
    entryTypeHelp: 'Selecciona "Crédito" para ingresos o "Deuda" para gastos',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'ej. Bonus por puntualidad, Combustible extra, Peaje...',
    amountLabel: 'Importe',
    amountPlaceholder: '100.00',
    amountHelp: 'Introduce solo el valor numérico. El signo se aplicará automáticamente según el tipo seleccionado.',
    allEntriesTitle: 'Todas las Entradas',
    allEntriesSubtitle: 'Historial completo de todas tus entradas registradas',
    noEntriesTitle: 'No hay entradas registradas',
    noEntriesMessage: 'Registra tu primera entrada usando el formulario de arriba',
    deleteEntryTitle: '¿Eliminar entrada?',
    deleteEntryMessage: 'Esta acción no se puede deshacer. Se eliminará la entrada permanentemente.',
    editEntryTitle: 'Editar Entrada',
    editEntrySubtitle: 'Modifica los datos de la entrada seleccionada',
    entryUpdated: 'Entrada actualizada exitosamente',
    entryUpdateError: 'Error al actualizar la entrada',
    
    // History
    historyTitle: 'Historial',
    historySubtitle: 'Consulta el historial completo de tus registros',
    filterByMonth: 'Filtrar por mes',
    exportData: 'Exportar datos',
    generateSummaryImage: 'Generar Resumen Visual',
    summaryImageGenerated: 'Resumen visual generado exitosamente',
    summaryImageError: 'Error al generar el resumen visual',
    downloadImage: 'Descargar Imagen',
    shareImage: 'Compartir Imagen',
    monthlySummaryTitle: 'Resumen del Período',
    monthlySummarySubtitle: 'Desglose detallado por categorías y tipos de entrada',
    tripsByCategory: 'Viajes por categoría',
    extrasTotal: 'Extras',
    expensesTotal: 'Gastos',
    noDataForPeriod: 'No hay datos para el período seleccionado',
    
    // Profile Settings
    profileTitle: 'Configuración del Perfil',
    profileSubtitle: 'Gestiona tu información personal y configuración de la aplicación',
    editProfileButton: 'Editar Perfil',
    saveChangesButton: 'Guardar Cambios',
    nameLabel: 'Nombre completo',
    companyNameLabel: 'Nombre de la empresa',
    salaryLabel: 'Salario mensual',
    monthlyGoalLabel: 'Objetivo mensual',
    annualGoalLabel: 'Objetivo anual calculado',
    languageLabel: 'Idioma',
    
    // Validation Messages
    nameRequired: 'El nombre no puede estar vacío',
    companyNameRequired: 'El nombre de la empresa no puede estar vacío',
    salaryPositive: 'El salario debe ser un número positivo',
    monthlyGoalPositive: 'El objetivo mensual debe ser un número positivo',
    descriptionRequired: 'Por favor, introduce una descripción',
    amountRequired: 'Por favor, introduce un importe válido',
    
    // Success Messages
    profileUpdated: 'Perfil actualizado exitosamente',
    categoryCreated: 'Categoría creada exitosamente',
    categoryUpdated: 'Categoría actualizada exitosamente',
    categoryDeleted: 'Categoría eliminada exitosamente',
    tripRegistered: 'Viaje registrado exitosamente',
    tripDeleted: 'Viaje eliminado exitosamente',
    entryRegistered: 'Entrada registrada exitosamente',
    entryDeleted: 'Entrada eliminada exitosamente',
    
    // Error Messages
    profileUpdateError: 'Error al actualizar el perfil',
    categoryCreateError: 'Error al crear la categoría',
    categoryUpdateError: 'Error al actualizar la categoría',
    categoryDeleteError: 'Error al eliminar la categoría',
    tripRegisterError: 'Error al registrar el viaje',
    tripDeleteError: 'Error al eliminar el viaje',
    entryRegisterError: 'Error al registrar la entrada',
    entryDeleteError: 'Error al eliminar la entrada',
    
    // Footer
    builtWith: 'Construido con',
    using: 'usando',
  },
  
  pt: {
    // Common
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    register: 'Registrar',
    confirm: 'Confirmar',
    close: 'Fechar',
    
    // Login & Setup
    loginTitle: 'Sistema de Pagamentos',
    loginSubtitle: 'Faça login para acessar seu painel de controle',
    loginButton: 'Fazer Login',
    setupTitle: 'Nome da sua empresa',
    setupSubtitle: 'Configure seu perfil para começar a usar o aplicativo',
    setupNameLabel: 'Seu nome completo',
    setupNamePlaceholder: 'ex. João Silva',
    setupCompanyLabel: 'Nome da sua empresa',
    setupCompanyPlaceholder: 'ex. Transportes Silva',
    setupSalaryLabel: 'Salário mensal fixo',
    setupSalaryPlaceholder: '2500.00',
    setupMonthlyGoalLabel: 'Objetivo mensal',
    setupMonthlyGoalPlaceholder: '3000.00',
    setupMonthlyGoalHelp: 'Meta financeira que deseja alcançar a cada mês',
    setupCreateButton: 'Criar Perfil',
    
    // Header
    paymentSystem: 'Sistema de Pagamentos',
    professionalDriver: 'Motorista Profissional',
    logout: 'Sair',
    
    // Navigation
    overview: 'Resumo',
    categories: 'Categorias',
    trips: 'Viagens',
    others: 'Outros',
    history: 'Histórico',
    settings: 'Configurações',
    
    // Monthly Overview
    monthlyOverviewTitle: 'Resumo Mensal',
    monthlyOverviewSubtitle: 'Visão geral dos seus ganhos do mês atual',
    totalEarnings: 'Ganhos Totais',
    monthlySalary: 'Salário Mensal',
    tripsEarnings: 'Ganhos por Viagens',
    othersEarnings: 'Outros Ganhos',
    categoryBreakdown: 'Detalhamento por Categoria',
    
    // Trip Categories
    tripCategoriesTitle: 'Categorias de Viagens',
    tripCategoriesSubtitle: 'Gerencie as categorias reutilizáveis para suas viagens',
    newCategoryButton: 'Nova Categoria',
    newCategoryTitle: 'Nova Categoria',
    newCategorySubtitle: 'Crie uma nova categoria de viagem com valor padrão',
    categoryNameLabel: 'Nome da categoria',
    categoryNamePlaceholder: 'ex. França, Lidl, Mercadona...',
    defaultAmountLabel: 'Valor padrão',
    defaultAmountPlaceholder: '150.00',
    editCategoryTitle: 'Editar Categoria',
    deleteCategoryTitle: 'Excluir categoria?',
    deleteCategoryMessage: 'Esta ação não pode ser desfeita. A categoria será excluída permanentemente.',
    noCategoriesTitle: 'Nenhuma categoria criada',
    noCategoriesMessage: 'Crie sua primeira categoria para organizar melhor suas viagens',
    
    // Trip Logging
    tripLoggingTitle: 'Registro de Viagens',
    tripLoggingSubtitle: 'Registre suas viagens e calcule automaticamente seus ganhos',
    newTripButton: 'Nova Viagem',
    newTripTitle: 'Nova Viagem',
    newTripSubtitle: 'Registre uma nova viagem com data e categoria personalizada',
    tripDateLabel: 'Data da viagem',
    tripCategoryLabel: 'Categoria',
    selectCategoryPlaceholder: 'Selecione uma categoria',
    tripAmountLabel: 'Valor',
    tripAmountPlaceholder: '150.00',
    recentTripsTitle: 'Viagens Recentes',
    noTripsTitle: 'Nenhuma viagem registrada',
    noTripsMessage: 'Registre sua primeira viagem usando o formulário acima',
    deleteTripTitle: 'Excluir viagem?',
    deleteTripMessage: 'Esta ação não pode ser desfeita. A viagem será excluída permanentemente.',
    editTripTitle: 'Editar Viagem',
    editTripSubtitle: 'Modifique os dados da viagem selecionada',
    tripUpdated: 'Viagem atualizada com sucesso',
    tripUpdateError: 'Erro ao atualizar a viagem',
    
    // Others Section
    othersTitle: 'Outras Receitas e Despesas',
    othersSubtitle: 'Gerencie receitas adicionais e despesas sem limite de quantidade',
    newEntryTitle: 'Nova Entrada',
    newEntrySubtitle: 'Registre quantas receitas adicionais ou despesas precisar com data personalizada',
    entryDateLabel: 'Data',
    entryTypeLabel: 'Tipo de entrada',
    credit: 'Crédito',
    debt: 'Débito',
    entryTypeHelp: 'Selecione "Crédito" para receitas ou "Débito" para despesas',
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'ex. Bônus por pontualidade, Combustível extra, Pedágio...',
    amountLabel: 'Valor',
    amountPlaceholder: '100.00',
    amountHelp: 'Digite apenas o valor numérico. O sinal será aplicado automaticamente conforme o tipo selecionado.',
    allEntriesTitle: 'Todas as Entradas',
    allEntriesSubtitle: 'Histórico completo de todas as suas entradas registradas',
    noEntriesTitle: 'Nenhuma entrada registrada',
    noEntriesMessage: 'Registre sua primeira entrada usando o formulário acima',
    deleteEntryTitle: 'Excluir entrada?',
    deleteEntryMessage: 'Esta ação não pode ser desfeita. A entrada será excluída permanentemente.',
    editEntryTitle: 'Editar Entrada',
    editEntrySubtitle: 'Modifique os dados da entrada selecionada',
    entryUpdated: 'Entrada atualizada com sucesso',
    entryUpdateError: 'Erro ao atualizar a entrada',
    
    // History
    historyTitle: 'Histórico',
    historySubtitle: 'Consulte o histórico completo dos seus registros',
    filterByMonth: 'Filtrar por mês',
    exportData: 'Exportar dados',
    generateSummaryImage: 'Gerar Resumo Visual',
    summaryImageGenerated: 'Resumo visual gerado com sucesso',
    summaryImageError: 'Erro ao gerar o resumo visual',
    downloadImage: 'Baixar Imagem',
    shareImage: 'Compartilhar Imagem',
    monthlySummaryTitle: 'Resumo do Período',
    monthlySummarySubtitle: 'Detalhamento por categorias e tipos de entrada',
    tripsByCategory: 'Viagens por categoria',
    extrasTotal: 'Extras',
    expensesTotal: 'Despesas',
    noDataForPeriod: 'Não há dados para o período selecionado',
    
    // Profile Settings
    profileTitle: 'Configurações do Perfil',
    profileSubtitle: 'Gerencie suas informações pessoais e configurações do aplicativo',
    editProfileButton: 'Editar Perfil',
    saveChangesButton: 'Salvar Alterações',
    nameLabel: 'Nome completo',
    companyNameLabel: 'Nome da empresa',
    salaryLabel: 'Salário mensal',
    monthlyGoalLabel: 'Objetivo mensal',
    annualGoalLabel: 'Objetivo anual calculado',
    languageLabel: 'Idioma',
    
    // Validation Messages
    nameRequired: 'O nome não pode estar vazio',
    companyNameRequired: 'O nome da empresa não pode estar vazio',
    salaryPositive: 'O salário deve ser um número positivo',
    monthlyGoalPositive: 'O objetivo mensal deve ser um número positivo',
    descriptionRequired: 'Por favor, digite uma descrição',
    amountRequired: 'Por favor, digite um valor válido',
    
    // Success Messages
    profileUpdated: 'Perfil atualizado com sucesso',
    categoryCreated: 'Categoria criada com sucesso',
    categoryUpdated: 'Categoria atualizada com sucesso',
    categoryDeleted: 'Categoria excluída com sucesso',
    tripRegistered: 'Viagem registrada com sucesso',
    tripDeleted: 'Viagem excluída com sucesso',
    entryRegistered: 'Entrada registrada com sucesso',
    entryDeleted: 'Entrada excluída com sucesso',
    
    // Error Messages
    profileUpdateError: 'Erro ao atualizar o perfil',
    categoryCreateError: 'Erro ao criar a categoria',
    categoryUpdateError: 'Erro ao atualizar a categoria',
    categoryDeleteError: 'Erro ao excluir a categoria',
    tripRegisterError: 'Erro ao registrar a viagem',
    tripDeleteError: 'Erro ao excluir a viagem',
    entryRegisterError: 'Erro ao registrar a entrada',
    entryDeleteError: 'Erro ao excluir a entrada',
    
    // Footer
    builtWith: 'Construído com',
    using: 'usando',
  },
  
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    register: 'Register',
    confirm: 'Confirm',
    close: 'Close',
    
    // Login & Setup
    loginTitle: 'Payment System',
    loginSubtitle: 'Log in to access your dashboard',
    loginButton: 'Log In',
    setupTitle: 'Your company name',
    setupSubtitle: 'Set up your profile to start using the application',
    setupNameLabel: 'Your full name',
    setupNamePlaceholder: 'e.g. John Smith',
    setupCompanyLabel: 'Your company name',
    setupCompanyPlaceholder: 'e.g. Smith Transport',
    setupSalaryLabel: 'Fixed monthly salary',
    setupSalaryPlaceholder: '2500.00',
    setupMonthlyGoalLabel: 'Monthly goal',
    setupMonthlyGoalPlaceholder: '3000.00',
    setupMonthlyGoalHelp: 'Financial target you want to achieve each month',
    setupCreateButton: 'Create Profile',
    
    // Header
    paymentSystem: 'Payment System',
    professionalDriver: 'Professional Driver',
    logout: 'Log out',
    
    // Navigation
    overview: 'Overview',
    categories: 'Categories',
    trips: 'Trips',
    others: 'Others',
    history: 'History',
    settings: 'Settings',
    
    // Monthly Overview
    monthlyOverviewTitle: 'Monthly Overview',
    monthlyOverviewSubtitle: 'Overview of your current month earnings',
    totalEarnings: 'Total Earnings',
    monthlySalary: 'Monthly Salary',
    tripsEarnings: 'Trip Earnings',
    othersEarnings: 'Other Earnings',
    categoryBreakdown: 'Category Breakdown',
    
    // Trip Categories
    tripCategoriesTitle: 'Trip Categories',
    tripCategoriesSubtitle: 'Manage reusable categories for your trips',
    newCategoryButton: 'New Category',
    newCategoryTitle: 'New Category',
    newCategorySubtitle: 'Create a new trip category with default amount',
    categoryNameLabel: 'Category name',
    categoryNamePlaceholder: 'e.g. France, Lidl, Mercadona...',
    defaultAmountLabel: 'Default amount',
    defaultAmountPlaceholder: '150.00',
    editCategoryTitle: 'Edit Category',
    deleteCategoryTitle: 'Delete category?',
    deleteCategoryMessage: 'This action cannot be undone. The category will be permanently deleted.',
    noCategoriesTitle: 'No categories created',
    noCategoriesMessage: 'Create your first category to better organize your trips',
    
    // Trip Logging
    tripLoggingTitle: 'Trip Logging',
    tripLoggingSubtitle: 'Log your trips and automatically calculate your earnings',
    newTripButton: 'New Trip',
    newTripTitle: 'New Trip',
    newTripSubtitle: 'Register a new trip with custom date and category',
    tripDateLabel: 'Trip date',
    tripCategoryLabel: 'Category',
    selectCategoryPlaceholder: 'Select a category',
    tripAmountLabel: 'Amount',
    tripAmountPlaceholder: '150.00',
    recentTripsTitle: 'Recent Trips',
    noTripsTitle: 'No trips registered',
    noTripsMessage: 'Register your first trip using the form above',
    deleteTripTitle: 'Delete trip?',
    deleteTripMessage: 'This action cannot be undone. The trip will be permanently deleted.',
    editTripTitle: 'Edit Trip',
    editTripSubtitle: 'Modify the selected trip data',
    tripUpdated: 'Trip updated successfully',
    tripUpdateError: 'Error updating trip',
    
    // Others Section
    othersTitle: 'Other Income and Expenses',
    othersSubtitle: 'Manage additional income and expenses with no quantity limit',
    newEntryTitle: 'New Entry',
    newEntrySubtitle: 'Register as many additional income or expenses as needed with custom date',
    entryDateLabel: 'Date',
    entryTypeLabel: 'Entry type',
    credit: 'Credit',
    debt: 'Debt',
    entryTypeHelp: 'Select "Credit" for income or "Debt" for expenses',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'e.g. Punctuality bonus, Extra fuel, Toll...',
    amountLabel: 'Amount',
    amountPlaceholder: '100.00',
    amountHelp: 'Enter only the numeric value. The sign will be applied automatically based on the selected type.',
    allEntriesTitle: 'All Entries',
    allEntriesSubtitle: 'Complete history of all your registered entries',
    noEntriesTitle: 'No entries registered',
    noEntriesMessage: 'Register your first entry using the form above',
    deleteEntryTitle: 'Delete entry?',
    deleteEntryMessage: 'This action cannot be undone. The entry will be permanently deleted.',
    editEntryTitle: 'Edit Entry',
    editEntrySubtitle: 'Modify the selected entry data',
    entryUpdated: 'Entry updated successfully',
    entryUpdateError: 'Error updating entry',
    
    // History
    historyTitle: 'History',
    historySubtitle: 'View the complete history of your records',
    filterByMonth: 'Filter by month',
    exportData: 'Export data',
    generateSummaryImage: 'Generate Visual Summary',
    summaryImageGenerated: 'Visual summary generated successfully',
    summaryImageError: 'Error generating visual summary',
    downloadImage: 'Download Image',
    shareImage: 'Share Image',
    monthlySummaryTitle: 'Period Summary',
    monthlySummarySubtitle: 'Detailed breakdown by categories and entry types',
    tripsByCategory: 'Trips by category',
    extrasTotal: 'Extras',
    expensesTotal: 'Expenses',
    noDataForPeriod: 'No data for the selected period',
    
    // Profile Settings
    profileTitle: 'Profile Settings',
    profileSubtitle: 'Manage your personal information and application settings',
    editProfileButton: 'Edit Profile',
    saveChangesButton: 'Save Changes',
    nameLabel: 'Full name',
    companyNameLabel: 'Company name',
    salaryLabel: 'Monthly salary',
    monthlyGoalLabel: 'Monthly goal',
    annualGoalLabel: 'Calculated annual goal',
    languageLabel: 'Language',
    
    // Validation Messages
    nameRequired: 'Name cannot be empty',
    companyNameRequired: 'Company name cannot be empty',
    salaryPositive: 'Salary must be a positive number',
    monthlyGoalPositive: 'Monthly goal must be a positive number',
    descriptionRequired: 'Please enter a description',
    amountRequired: 'Please enter a valid amount',
    
    // Success Messages
    profileUpdated: 'Profile updated successfully',
    categoryCreated: 'Category created successfully',
    categoryUpdated: 'Category updated successfully',
    categoryDeleted: 'Category deleted successfully',
    tripRegistered: 'Trip registered successfully',
    tripDeleted: 'Trip deleted successfully',
    entryRegistered: 'Entry registered successfully',
    entryDeleted: 'Entry deleted successfully',
    
    // Error Messages
    profileUpdateError: 'Error updating profile',
    categoryCreateError: 'Error creating category',
    categoryUpdateError: 'Error updating category',
    categoryDeleteError: 'Error deleting category',
    tripRegisterError: 'Error registering trip',
    tripDeleteError: 'Error deleting trip',
    entryRegisterError: 'Error registering entry',
    entryDeleteError: 'Error deleting entry',
    
    // Footer
    builtWith: 'Built with',
    using: 'using',
  },
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.es;
};

export const languageNames: Record<Language, string> = {
  es: 'Español',
  pt: 'Português',
  en: 'English',
};
