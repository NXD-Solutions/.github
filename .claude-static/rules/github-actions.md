# GitHub Actions

## Workflow summary — process explanation

Every workflow must include a process explanation in its earliest job's first step `run:` block, written to `$GITHUB_STEP_SUMMARY`. This gives operators immediate context when viewing a run.

**Template:**
```bash
{
  echo "## <Workflow Name>"
  echo ""
  echo "**Purpose**: <one-line description of what the workflow does>"
  echo ""
  echo "**Process**:"
  echo "- *<Job 1 name>* — <what it does>"
  echo "- *<Job 2 name>* — <what it does>"
  echo "- *<Job N name>* — <what it does>"
} >> "$GITHUB_STEP_SUMMARY"
```

Job names in the process list must match the labels visible in the GitHub Actions UI.