export const formatBs = (value: number) =>
  `Bs ${value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
