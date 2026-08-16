import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SearchInput } from '@/components/filters/SearchInput';
import { SelectDropdown } from '@/components/filters/SelectDropdown';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BackButton } from '@/components/ui/BackButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { glossaryTerms } from '@/data/glossary';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getGlossaryTerms } from '@/services/learningService';

export default function GlossaryScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const glossaryState = useAsyncData(getGlossaryTerms, glossaryTerms, []);
  const categoryOptions = useMemo(
    () => [
      { label: 'All categories', value: 'All categories' },
      ...Array.from(new Set(glossaryState.data.map((term) => term.category).filter(Boolean))).map((item) => ({
        label: String(item),
        value: String(item),
      })),
    ],
    [glossaryState.data]
  );
  const filtered = glossaryState.data.filter((term) => {
    const text = `${term.term} ${term.shortDefinition} ${term.category ?? ''}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === 'All categories' || term.category === category);
  });

  return (
    <AppScreen bottomInset={88}>
      <BackButton fallback={() => router.replace(routes.learn)} />
      <PageHeader title="Glossary" subtitle="Learn common market terms in simple language." />
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search glossary terms" />
      <View style={styles.dropdownRow}>
        <SelectDropdown label="Category" value={category} options={categoryOptions} onChange={setCategory} />
      </View>
      {glossaryState.isLoading ? <InfoBox>Loading glossary...</InfoBox> : null}
      {!glossaryState.isLoading && glossaryState.isFallback ? <InfoBox>Showing educational sample terms.</InfoBox> : null}
      {filtered.length > 0 ? (
        filtered.map((term) => {
          const isExpanded = expandedTerm === term.id;
          return (
            <AppCard key={term.id}>
              <View style={styles.cardHeader}>
                <Text style={styles.term}>{term.term}</Text>
                <SourceBadge label={term.sourceLabel} />
              </View>
              <Text style={styles.definition}>{term.shortDefinition}</Text>
              {isExpanded && term.detailedDefinition ? <Text style={styles.detail}>{term.detailedDefinition}</Text> : null}
              <Pressable onPress={() => setExpandedTerm(isExpanded ? null : term.id)}>
                <Text style={styles.readMore}>{isExpanded ? 'Show less' : 'Read more'}</Text>
              </Pressable>
            </AppCard>
          );
        })
      ) : (
        <EmptyState title="No glossary terms" message="Try a different term or category." />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  dropdownRow: {
    flexDirection: 'row',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  term: {
    color: colors.primary,
    fontFamily: typography.bold,
    fontSize: 18,
  },
  definition: {
    color: colors.text,
    fontFamily: typography.medium,
    fontSize: 14,
    lineHeight: 21,
  },
  detail: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  readMore: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
});
