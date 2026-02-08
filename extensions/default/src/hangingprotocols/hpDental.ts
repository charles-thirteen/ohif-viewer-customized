import { Types } from '@ohif/core';

/**
 * Dental 2x2 Hanging Protocol
 *
 * Layout:
 *   ┌──────────────────┬──────────────────┐
 *   │  Current image   │  Prior exam      │
 *   │  (study 0, s0)   │  (study 1, s0)   │
 *   ├──────────────────┼──────────────────┤
 *   │  Bitewing (s1)   │  Bitewing (s2)   │
 *   │  placeholder     │  placeholder     │
 *   └──────────────────┴──────────────────┘
 *
 * - Top-left:   Current study, first matching series
 * - Top-right:  Prior exam (same modality), first matching series
 * - Bottom-left / Bottom-right: Additional series from current study
 *   intended as bitewing placeholders (series index 1 and 2)
 */

// ─── Display-set selectors ──────────────────────────────────────────────────

/** Current study – first series with images */
const currentDisplaySetSelector = {
  studyMatchingRules: [
    {
      attribute: 'studyInstanceUIDsIndex',
      from: 'options',
      required: true,
      constraint: {
        equals: { value: 0 },
      },
    },
  ],
  seriesMatchingRules: [
    {
      attribute: 'numImageFrames',
      constraint: {
        greaterThan: { value: 0 },
      },
    },
  ],
};

/** Prior study – first series with images (same modality handled by OHIF) */
const priorDisplaySetSelector = {
  studyMatchingRules: [
    {
      attribute: 'studyInstanceUIDsIndex',
      from: 'options',
      required: true,
      constraint: {
        equals: { value: 1 },
      },
    },
  ],
  seriesMatchingRules: [
    {
      attribute: 'numImageFrames',
      constraint: {
        greaterThan: { value: 0 },
      },
    },
  ],
};

/**
 * Bitewing selector – matches series from the current study whose
 * SeriesDescription contains "bitewing" (case-insensitive).
 * Falls back to any image series when no bitewing-labelled series exists.
 */
const bitewingDisplaySetSelector = {
  studyMatchingRules: [
    {
      attribute: 'studyInstanceUIDsIndex',
      from: 'options',
      required: true,
      constraint: {
        equals: { value: 0 },
      },
    },
  ],
  seriesMatchingRules: [
    {
      attribute: 'numImageFrames',
      constraint: {
        greaterThan: { value: 0 },
      },
    },
    {
      weight: 10,
      attribute: 'SeriesDescription',
      constraint: {
        containsI: 'bitewing',
      },
    },
  ],
};

// ─── Viewport helpers ───────────────────────────────────────────────────────

const currentViewport = {
  viewportOptions: {
    toolGroupId: 'default',
    allowUnmatchedView: true,
  },
  displaySets: [{ id: 'currentDisplaySetId' }],
};

const priorViewport = {
  viewportOptions: {
    toolGroupId: 'default',
    allowUnmatchedView: true,
  },
  displaySets: [{ id: 'priorDisplaySetId' }],
};

const bitewingViewport0 = {
  viewportOptions: {
    toolGroupId: 'default',
    allowUnmatchedView: true,
  },
  displaySets: [
    {
      id: 'bitewingDisplaySetId',
      matchedDisplaySetsIndex: 0,
    },
  ],
};

const bitewingViewport1 = {
  viewportOptions: {
    toolGroupId: 'default',
    allowUnmatchedView: true,
  },
  displaySets: [
    {
      id: 'bitewingDisplaySetId',
      matchedDisplaySetsIndex: 1,
    },
  ],
};

// ─── Protocol ───────────────────────────────────────────────────────────────

const hpDental: Types.HangingProtocol.Protocol = {
  id: '@ohif/hpDental',
  description: 'Dental 2x2: current image, prior exam, and bitewing placeholders',
  name: 'Dental 2x2',
  numberOfPriorsReferenced: 1,
  protocolMatchingRules: [],
  toolGroupIds: ['default'],

  displaySetSelectors: {
    currentDisplaySetId: currentDisplaySetSelector,
    priorDisplaySetId: priorDisplaySetSelector,
    bitewingDisplaySetId: bitewingDisplaySetSelector,
  },

  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
      allowUnmatchedView: true,
    },
    displaySets: [
      {
        id: 'currentDisplaySetId',
        matchedDisplaySetsIndex: -1,
      },
    ],
  },

  stages: [
    // ── 2x2 stage: requires at least 2 viewports matched ──
    {
      name: 'dental2x2',
      stageActivation: {
        enabled: {
          minViewportsMatched: 2,
        },
      },
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 2,
          columns: 2,
        },
      },
      viewports: [
        currentViewport,   // top-left:     current image
        priorViewport,     // top-right:    prior exam
        bitewingViewport0, // bottom-left:  bitewing placeholder 1
        bitewingViewport1, // bottom-right: bitewing placeholder 2
      ],
    },

    // ── Fallback 1x1 stage ──
    {
      name: 'dental1x1',
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 1,
          columns: 1,
        },
      },
      viewports: [currentViewport],
    },
  ],
};

export default hpDental;
