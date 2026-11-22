import { describe, it, expect } from 'vitest';
import {
  extractPlaceholderKeys,
  substitutePlaceholders,
  checkPlaceholderConsistency,
  sampleValues,
} from '../../lib/utils/placeholders';

describe('extractPlaceholderKeys', () => {
  it('extracts distinct keys in order of first appearance', () => {
    const t = 'Move {folder} into {target}, then re-check {folder}.';
    expect(extractPlaceholderKeys(t)).toEqual(['folder', 'target']);
  });

  it('supports underscores and hyphens', () => {
    expect(extractPlaceholderKeys('{file_name} {repo-url}')).toEqual([
      'file_name',
      'repo-url',
    ]);
  });

  it('returns nothing for a template with no placeholders', () => {
    expect(extractPlaceholderKeys('just plain text')).toEqual([]);
  });
});

describe('substitutePlaceholders', () => {
  it('substitutes provided values', () => {
    const out = substitutePlaceholders('Hello {name}!', { name: 'Bill' });
    expect(out).toBe('Hello Bill!');
  });

  it('leaves unknown placeholders intact for the user to fill', () => {
    const out = substitutePlaceholders('{a} and {b}', { a: 'X' });
    expect(out).toBe('X and {b}');
  });

  it('does not recursively expand replacement text', () => {
    const out = substitutePlaceholders('{a}', { a: '{b}' });
    expect(out).toBe('{b}');
  });
});

describe('checkPlaceholderConsistency', () => {
  it('passes when template and declared keys match', () => {
    const result = checkPlaceholderConsistency('{x} {y}', [
      { key: 'x' },
      { key: 'y' },
    ]);
    expect(result.ok).toBe(true);
  });

  it('flags undeclared template keys', () => {
    const result = checkPlaceholderConsistency('{x} {y}', [{ key: 'x' }]);
    expect(result.ok).toBe(false);
    expect(result.undeclared).toEqual(['y']);
  });

  it('flags declared-but-unused keys', () => {
    const result = checkPlaceholderConsistency('{x}', [
      { key: 'x' },
      { key: 'z' },
    ]);
    expect(result.ok).toBe(false);
    expect(result.unused).toEqual(['z']);
  });
});

describe('sampleValues', () => {
  it('maps each placeholder key to its sample', () => {
    const values = sampleValues([
      { key: 'folder', label: 'Folder', sample: '/tmp' },
      { key: 'name', label: 'Name', sample: 'Bill' },
    ]);
    expect(values).toEqual({ folder: '/tmp', name: 'Bill' });
  });
});
