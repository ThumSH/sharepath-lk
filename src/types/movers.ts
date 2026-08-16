export type TopMoverType = 'gainer' | 'loser' | 'most_traded';

export type TopMover = {
  id: string;
  moverDate: string;
  companySymbol: string;
  companyName: string;
  movementType: TopMoverType;
  changePercent?: number | null;
  tradedVolume?: number | null;
  turnover?: number | null;
  sourceLabel?: string;
};

export type TopMoverDbRow = {
  id: string;
  mover_date: string;
  company_symbol: string;
  company_name: string;
  movement_type: TopMoverType;
  change_percent: number | string | null;
  traded_volume: number | string | null;
  turnover: number | string | null;
  source_label: string | null;
};
