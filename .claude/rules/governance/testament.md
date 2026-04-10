# Testament

Maintain the testament defined by the underlying environment — a local record that injects
repo-specific behavioral changes into context ahead of permanent formalization. Never
distributed. Permanent changes exit via the normal rule path.

Two entry types:

**Workaround** — a recurring problem with a non-obvious solution. Add when a problem was
solved before, or when a non-obvious workaround is discovered. Remove when permanently fixed.

**Improvement signal** — a finding from repo work not yet accepted upstream. Add when a
finding warrants upstream consideration but has not yet been proposed. Remove when accepted,
rejected, or promoted to a CR.

A title is required. Templates are preferred — free form is acceptable when neither fits.

Workaround template:
```
## <Title>
**Symptom:** ...
**Solution:** ...
**Permanent fix candidate:** ...
```

Improvement signal template:
```
## <Title>
**Observation:** ...
**Upstream target:** ...
```
