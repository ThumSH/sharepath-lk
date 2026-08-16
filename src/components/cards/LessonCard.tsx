import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Lesson } from '@/types/lesson';
import { colors, radii, spacing, typography } from '@/lib/constants';

type LessonCardProps = {
  lesson: Lesson;
  onPress: () => void;
};

export function LessonCard({ lesson, onPress }: LessonCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <Text style={styles.category}>{lesson.category}</Text>
        <Text style={styles.time}>{lesson.readingTime}</Text>
      </View>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {lesson.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: 20,
    boxShadow: '0 8px 20px rgba(11, 31, 51, 0.045)',
  },
  pressed: {
    opacity: 0.78,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: colors.gold,
    fontFamily: typography.semiBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  time: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 17,
    lineHeight: 22,
  },
  description: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
  },
});
