import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"

export interface TermItem {
  id: string
  /** 필수 동의 항목 여부. */
  required: boolean
  title: string
  /** 항목 하단에 노출되는 동의 질문 문구. */
  question: string
  /** [보기] 모달에 표시되는 약관 전문. */
  body: string
}

export interface TermsAgreementProps {
  terms: TermItem[]
  /**
   * 필수 항목이 모두 체크되면 true 로 올려준다.
   * 부모는 이 값으로 onNext 버튼의 활성화를 제어한다.
   */
  onAllRequiredAgreedChange?: (allRequiredAgreed: boolean) => void
}

/**
 * 약관동의 블록. 회원가입 1단계(A-02)와 상품가입 1단계(C-03)가 공용한다.
 * 데이터는 props 로만 받고, 체크 상태만 내부에서 관리하는 프레젠테이션 컴포넌트.
 */
export function TermsAgreement({
  terms,
  onAllRequiredAgreedChange,
}: TermsAgreementProps) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({})
  const [viewing, setViewing] = React.useState<TermItem | null>(null)

  const allChecked = terms.length > 0 && terms.every((t) => checked[t.id])
  const allRequiredAgreed = terms
    .filter((t) => t.required)
    .every((t) => checked[t.id])

  React.useEffect(() => {
    onAllRequiredAgreedChange?.(allRequiredAgreed)
  }, [allRequiredAgreed, onAllRequiredAgreedChange])

  const toggleAll = () => {
    const next = !allChecked
    const map: Record<string, boolean> = {}
    for (const t of terms) map[t.id] = next
    setChecked(map)
  }

  const toggleOne = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const agreeFromModal = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: true }))
    setViewing(null)
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
      {/* 전체 동의 */}
      <div className="flex items-center justify-between bg-surface px-5 py-4">
        <Checkbox
          checked={allChecked}
          onChange={toggleAll}
          label={
            <span className="text-lg font-bold text-ink">약관 전체 동의</span>
          }
        />
        <span className="text-sm text-ink-muted">
          필수 및 선택 항목에 모두 동의합니다.
        </span>
      </div>

      <ul>
        {terms.map((term) => (
          <li
            key={term.id}
            className="border-t border-[var(--color-border)]"
          >
            {/* 윗줄: 뱃지 + 약관명 + 보기 */}
            <div className="flex items-center justify-between gap-3 px-5 pt-4">
              <div className="flex items-center gap-2">
                <Badge variant={term.required ? "primary" : "neutral"}>
                  {term.required ? "필수" : "선택"}
                </Badge>
                <span className="text-base font-bold text-ink">
                  {term.title}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setViewing(term)}
              >
                보기
              </Button>
            </div>

            {/* 아랫줄: 동의 질문 + 체크박스 */}
            <div className="mx-5 my-3 flex items-center justify-between gap-3 rounded-[var(--radius)] bg-surface-2 px-4 py-3">
              <label
                htmlFor={`agree-${term.id}`}
                className="text-sm text-ink-muted"
              >
                {term.question}
              </label>
              <Checkbox
                id={`agree-${term.id}`}
                checked={!!checked[term.id]}
                onChange={() => toggleOne(term.id)}
                aria-label={`${term.title} 동의`}
              />
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing?.title ?? ""}
        size="lg"
        footer={
          viewing && (
            <>
              <Button variant="secondary" onClick={() => setViewing(null)}>
                닫기
              </Button>
              <Button onClick={() => agreeFromModal(viewing.id)}>동의</Button>
            </>
          )
        }
      >
        <div className="max-h-[52vh] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-ink">
          {viewing?.body}
        </div>
      </Modal>
    </div>
  )
}
