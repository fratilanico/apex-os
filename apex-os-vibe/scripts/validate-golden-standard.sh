#!/bin/bash
# GOLDEN STANDARD VALIDATOR
# Validates any output/file against APEX OS Golden Standard Protocol
# Usage: ./scripts/validate-golden-standard.sh [file]
# Returns: 0 if compliant, 1 if violations found

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

FILE="${1:-}"
VIOLATIONS=0
WARNINGS=0

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🔱 GOLDEN STANDARD VALIDATOR                                                ║${NC}"
echo -e "${CYAN}║  Version: 1.0.0 | Authority: Nicolae Fratila                                 ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if file provided
if [ -z "$FILE" ]; then
    echo -e "${RED}❌ ERROR: No file specified${NC}"
    echo "Usage: ./scripts/validate-golden-standard.sh [file]"
    exit 1
fi

if [ ! -f "$FILE" ]; then
    echo -e "${RED}❌ ERROR: File not found: $FILE${NC}"
    exit 1
fi

echo -e "${CYAN}📄 Validating: $FILE${NC}"
echo ""

# Rule 001: Must contain double-line header (╔)
echo -e "${CYAN}🔍 Rule 001: Double-line header banners${NC}"
if grep -q "╔" "$FILE"; then
    HEADER_COUNT=$(grep -o "╔" "$FILE" | wc -l)
    echo -e "${GREEN}  ✅ PASS: Found $HEADER_COUNT header banner(s)${NC}"
else
    echo -e "${RED}  ❌ VIOLATION: No double-line headers found (╔)${NC}"
    echo -e "${YELLOW}     Fix: Add ╔═══╗ header banners to major sections${NC}"
    ((VIOLATIONS++))
fi

# Rule 002: Tables must use box-drawing characters
echo -e "${CYAN}🔍 Rule 002: ASCII table formatting${NC}"
if grep -q "[┌┐└┘├┤┬┴┼─│]" "$FILE"; then
    TABLE_COUNT=$(grep -c "[┌┐└┘]" "$FILE" || true)
    echo -e "${GREEN}  ✅ PASS: Found box-drawing characters in tables${NC}"
else
    echo -e "${YELLOW}  ⚠️  WARNING: No box-drawing tables found${NC}"
    echo -e "${YELLOW}     Suggestion: Use ┌───┐ └───┘ for data tables${NC}"
    ((WARNINGS++))
fi

# Rule 003: Progress bars must be 10 blocks
echo -e "${CYAN}🔍 Rule 003: Progress bar format (10 blocks)${NC}"
PROGRESS_BARS=$(grep -o "\[█\{1,10\}░\{0,10\}\]" "$FILE" 2>/dev/null || true)
if [ -n "$PROGRESS_BARS" ]; then
    VALID_BARS=$(echo "$PROGRESS_BARS" | grep -c "\[█\{1,10\}░\{0,10\}\]" || true)
    echo -e "${GREEN}  ✅ PASS: Found $VALID_BARS progress bar(s)${NC}"
    
    # Check for invalid formats
    INVALID_BARS=$(grep -o "\[█\{11,\}░*\]\|\[░\{11,\}█*\]" "$FILE" 2>/dev/null || true)
    if [ -n "$INVALID_BARS" ]; then
        echo -e "${RED}  ❌ VIOLATION: Progress bars with more than 10 blocks found${NC}"
        echo -e "${YELLOW}     Fix: Use exactly 10 blocks total [████████░░]${NC}"
        ((VIOLATIONS++))
    fi
else
    echo -e "${YELLOW}  ⚠️  WARNING: No progress bars found${NC}"
    echo -e "${YELLOW}     Suggestion: Add progress indicators [████████░░] 80%${NC}"
    ((WARNINGS++))
fi

# Rule 004: Status icons must be from approved list
echo -e "${CYAN}🔍 Rule 004: Status icon usage${NC}"
APPROVED_ICONS="🟢🔴🟡⚪✅❌ℹ️🔥⚡🚀💰🧠🛡️⚙️🔒"
FOUND_ICONS=$(grep -o "[$APPROVED_ICONS]" "$FILE" 2>/dev/null | sort -u | tr -d '\n' || true)
if [ -n "$FOUND_ICONS" ]; then
    ICON_COUNT=$(grep -o "[$APPROVED_ICONS]" "$FILE" 2>/dev/null | wc -l || true)
    echo -e "${GREEN}  ✅ PASS: Found $ICON_COUNT approved icon(s)${NC}"
else
    echo -e "${YELLOW}  ⚠️  WARNING: No status icons found${NC}"
    echo -e "${YELLOW}     Suggestion: Use 🟢🔴🟡 for status indicators${NC}"
    ((WARNINGS++))
fi

# Rule 005: Code blocks must have syntax highlighting
echo -e "${CYAN}🔍 Rule 005: Code block syntax highlighting${NC}"
CODE_BLOCKS=$(grep -c "^\`\`\`" "$FILE" || true)
if [ "$CODE_BLOCKS" -gt 0 ]; then
    LANG_BLOCKS=$(grep -E "^\`\`\`(typescript|javascript|bash|json|python|go|rust|css|html|markdown)" "$FILE" | wc -l || true)
    if [ "$LANG_BLOCKS" -gt 0 ]; then
        echo -e "${GREEN}  ✅ PASS: Found $LANG_BLOCKS code block(s) with syntax highlighting${NC}"
    else
        echo -e "${YELLOW}  ⚠️  WARNING: Code blocks without language specification${NC}"
        echo -e "${YELLOW}     Suggestion: Use \`\`\`typescript, \`\`\`bash, etc.${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}  ⚠️  WARNING: No code blocks found${NC}"
    ((WARNINGS++))
fi

# Rule 006: Tony Stark tone
echo -e "${CYAN}🔍 Rule 006: Tony Stark tone${NC}"
TONY_PHRASES=("Listen up" "Here's the deal" "Alright, here's how" "Now pay attention" "No excuses" "You KNOW" "Full wire mode")
TONY_FOUND=0
for phrase in "${TONY_PHRASES[@]}"; do
    if grep -qi "$phrase" "$FILE"; then
        ((TONY_FOUND++))
    fi
done

if [ $TONY_FOUND -gt 0 ]; then
    echo -e "${GREEN}  ✅ PASS: Found $TONY_FOUND Tony Stark phrase(s)${NC}"
else
    echo -e "${YELLOW}  ⚠️  WARNING: No Tony Stark tone detected${NC}"
    echo -e "${YELLOW}     Suggestion: Add phrases like 'Listen up -' or 'Here's the deal...'${NC}"
    ((WARNINGS++))
fi

# Rule 007: No uncertain language
echo -e "${CYAN}🔍 Rule 007: Confidence markers${NC}"
UNCERTAIN_WORDS=("I think" "maybe" "perhaps" "should" "might")
UNCERTAIN_FOUND=0
for word in "${UNCERTAIN_WORDS[@]}"; do
    COUNT=$(grep -ci "\b$word\b" "$FILE" || true)
    if [ "$COUNT" -gt 0 ]; then
        UNCERTAIN_FOUND=$((UNCERTAIN_FOUND + COUNT))
    fi
done

if [ $UNCERTAIN_FOUND -eq 0 ]; then
    echo -e "${GREEN}  ✅ PASS: No uncertain language found${NC}"
else
    echo -e "${YELLOW}  ⚠️  WARNING: Found $UNCERTAIN_FOUND uncertain word(s)${NC}"
    echo -e "${YELLOW}     Suggestion: Replace 'I think' with 'You KNOW', 'maybe' with 'definitely'${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  VALIDATION SUMMARY                                                          ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════════════════╣${NC}"

if [ $VIOLATIONS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${CYAN}║  Status: ${GREEN}✅ FULLY COMPLIANT${CYAN}                                                      ║${NC}"
    echo -e "${CYAN}║  Score:  [██████████] 100%                                                   ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🎉 Golden Standard achieved! This output is production-ready.${NC}"
    exit 0
elif [ $VIOLATIONS -eq 0 ]; then
    echo -e "${CYAN}║  Status: ${YELLOW}⚠️  COMPLIANT WITH WARNINGS${CYAN}                                        ║${NC}"
    echo -e "${CYAN}║  Violations: ${GREEN}0${CYAN} | Warnings: ${YELLOW}$WARNINGS${CYAN}                                          ║${NC}"
    echo -e "${CYAN}║  Score:  [███████░░░] 85%                                                    ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Address warnings for 100% compliance.${NC}"
    exit 0
else
    echo -e "${CYAN}║  Status: ${RED}🔴 NON-COMPLIANT${CYAN}                                                         ║${NC}"
    echo -e "${CYAN}║  Violations: ${RED}$VIOLATIONS${CYAN} | Warnings: ${YELLOW}$WARNINGS${CYAN}                                          ║${NC}"
    SCORE=$((100 - (VIOLATIONS * 10) - (WARNINGS * 5)))
    if [ $SCORE -lt 0 ]; then SCORE=0; fi
    echo -e "${CYAN}║  Score:  [$(printf '%*s' $((SCORE/10)) '' | tr ' ' '█')$(printf '%*s' $((10-SCORE/10)) '' | tr ' ' '░')] ${SCORE}%${CYAN}                                                    ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}❌ Fix violations before deployment. Run auto-formatter:${NC}"
    echo -e "${YELLOW}   ./scripts/auto-format-golden.sh $FILE${NC}"
    exit 1
fi