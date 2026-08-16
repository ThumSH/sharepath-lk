import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { glossaryTerms } from '@/data/glossary';
import { routes } from '@/lib/routes';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { AppCard } from '@/components/ui/AppCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type TermTooltipProps = {
  term: string;
  children?: string;
};

export function TermTooltip({ term, children }: TermTooltipProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const glossaryTerm = useMemo(
    () => glossaryTerms.find((item) => item.term.toLowerCase() === term.toLowerCase()),
    [term]
  );

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setIsOpen(true)}>
        <Text style={styles.term}>{children ?? term}</Text>
        <Feather name="info" color={colors.primary} size={14} />
      </Pressable>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <AppCard style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{glossaryTerm?.term ?? term}</Text>
              <Pressable onPress={() => setIsOpen(false)} style={styles.close}>
                <Feather name="x" color={colors.primary} size={18} />
              </Pressable>
            </View>
            <Text style={styles.definition}>
              {glossaryTerm?.shortDefinition ?? 'This term will be added to the glossary soon.'}
            </Text>
            {glossaryTerm?.detailedDefinition ? (
              <Text style={styles.detail}>{glossaryTerm.detailedDefinition}</Text>
            ) : null}
            <PrimaryButton
              variant="secondary"
              onPress={() => {
                setIsOpen(false);
                router.push(routes.glossary);
              }}>
              View Glossary
            </PrimaryButton>
          </AppCard>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  term: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  overlay: {
    backgroundColor: 'rgba(11, 31, 51, 0.24)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    maxWidth: 480,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 18,
  },
  close: {
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.full,
    height: 34,
    justifyContent: 'center',
    width: 34,
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
});
