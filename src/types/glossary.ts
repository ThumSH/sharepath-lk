export type GlossaryTerm = {
  id: string;
  term: string;
  shortDefinition: string;
  detailedDefinition?: string | null;
  category?: string | null;
  relatedLessonId?: string | null;
  sortOrder?: number;
  sourceLabel?: string;
};

export type GlossaryTermDbRow = {
  id: string;
  term: string;
  short_definition: string;
  detailed_definition: string | null;
  category: string | null;
  related_lesson_id: string | null;
  sort_order: number | null;
  source_label: string | null;
};
