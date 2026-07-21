---
name: sdd-spec-writing
description: Use when creating, reviewing, or updating Specification-Driven Development specs in .specs, including file naming with YYYY-MM-DD-subject.md, requirements, acceptance criteria, domain rules, architecture notes, risks, and implementation traceability.
---

# SDD Spec Writing

Use this skill when writing specs before implementation. A spec should make the intended behavior clear enough that implementation, tests, and review can trace back to it.

## File Naming

Create specs in the project root `.specs/` directory.

Use this filename format:

```text
YYYY-MM-DD-subject.md
```

Rules:

- Use the current local date unless the user explicitly asks for another date.
- Use lowercase kebab-case for the subject.
- Keep the subject short and specific.
- Prefer domain or capability names over technical tasks.
- Example: `2026-07-14-order-notification-intake.md`.

## Spec Structure

Use these sections unless the change is tiny and a section is genuinely irrelevant:

```markdown
# <Title>

## Context

## Problem

## Goals

## Non-Goals

## Requirements

## Acceptance Criteria

## Domain Rules

## Interfaces and Contracts

## Architecture Notes

## Data and Persistence

## Observability

## Risks and Open Questions

## Test Strategy

## Implementation Trace
```

## Writing Rules

- Start from user-visible behavior and business constraints.
- Separate requirements from implementation choices.
- Use `shall` for hard requirements.
- Make requirements atomic and numbered when there are multiple.
- Write acceptance criteria as verifiable outcomes.
- Capture non-goals to prevent scope creep.
- Record assumptions explicitly.
- Prefer precise examples over abstract explanations.
- Avoid committing to specific frameworks or classes unless the decision is part of the spec.

## Requirements

Format requirements as:

```markdown
- `REQ-001`: The system shall ...
- `REQ-002`: The system shall ...
```

Good requirements are testable, scoped, and stable. Avoid combining multiple behaviors in one requirement.

## Acceptance Criteria

Use Given/When/Then when it clarifies behavior:

```markdown
- Given ...
  When ...
  Then ...
```

For simpler cases, concise bullets are fine:

```markdown
- The intake endpoint rejects requests with an invalid provider signature.
- Duplicate inbound events do not trigger duplicate downstream processing.
```

## Architecture Notes

Use this section for decisions that shape implementation:

- hexagonal boundaries and ports
- external systems such as provider APIs, message brokers, runtimes, or a managed database
- generated OpenAPI contracts
- idempotency and retry strategy
- transaction or consistency boundaries

Do not turn this into a full implementation plan unless the spec needs it.

## Test Strategy

Tie tests back to requirements:

```markdown
- `REQ-001`: Unit test ...
- `REQ-002`: Integration test ...
```

Cover happy path, validation errors, duplicate inputs, external failures, and observability expectations when relevant.

## Implementation Trace

Leave this section empty or skeletal when creating the spec before implementation. Fill it during or after implementation with links to files, tests, and decisions.

```markdown
- `REQ-001`: Pending
- `REQ-002`: Pending
```

## Quality Checklist

Before finishing a spec, verify:

- Filename follows `YYYY-MM-DD-subject.md`.
- The problem and goals are clear without reading implementation code.
- Requirements are numbered and testable.
- Acceptance criteria can be verified manually or by automated tests.
- External contracts and data shape are captured when relevant.
- Risks and open questions are explicit.
- The spec avoids unnecessary implementation detail.
