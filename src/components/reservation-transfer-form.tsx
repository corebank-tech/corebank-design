import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Radio } from "@/components/ui/radio"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormSection } from "@/components/ui/form-section"
import { FormRow } from "@/components/ui/form-row"

export function ReservationTransferForm() {
  const [type, setType] = React.useState("single")

  return (
    <div>
      <div className="border border-[var(--color-border)] bg-white p-6">
      <FormSection
        title="출금 정보"
        action={<Badge variant="primary">잔액 12,340,500원</Badge>}
      >
        <div>
          <FormRow label="출금계좌" required htmlFor="from-acct">
            <Select id="from-acct" className="max-w-xs">
              <option>110-234-567890 (자유입출금)</option>
              <option>302-998-112233 (급여통장)</option>
            </Select>
          </FormRow>
          <FormRow label="출금계좌 비밀번호" required htmlFor="acct-pw">
            <Input
              id="acct-pw"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              className="max-w-[160px] tracking-widest"
            />
          </FormRow>
        </div>
      </FormSection>

      <FormSection title="입금 정보">
        <div>
          <FormRow label="입금계좌번호" required htmlFor="to-acct">
            <Input
              id="to-acct"
              inputMode="numeric"
              placeholder="- 없이 숫자만 입력"
              className="max-w-xs"
            />
            <Button variant="outline" size="md">
              계좌확인
            </Button>
          </FormRow>
          <FormRow label="이체금액" required htmlFor="amount">
            <Input
              id="amount"
              inputMode="numeric"
              placeholder="0"
              className="max-w-xs text-right"
            />
            <span className="text-sm text-ink-muted">원</span>
          </FormRow>
          <FormRow label="받는분 표기">
            <Input placeholder="상대 통장에 표기될 내용" className="max-w-xs" />
          </FormRow>
        </div>
      </FormSection>

      <FormSection title="예약 설정" className="mb-0">
        <div>
          <FormRow label="예약유형" required>
            <div className="flex flex-wrap items-center gap-4">
              <Radio
                name="reserve-type"
                label="1회 예약"
                checked={type === "single"}
                onChange={() => setType("single")}
              />
              <Radio
                name="reserve-type"
                label="반복 예약"
                checked={type === "repeat"}
                onChange={() => setType("repeat")}
              />
            </div>
          </FormRow>
          <FormRow label="예약일자" required htmlFor="reserve-date">
            <Input id="reserve-date" type="date" className="max-w-[200px]" />
          </FormRow>
        </div>
      </FormSection>
      </div>

      <div className="flex items-center justify-center gap-2 pt-6">
        <Button variant="secondary" size="lg" className="min-w-[120px]">
          취소
        </Button>
        <Button variant="primary" size="lg" className="min-w-[160px]">
          예약이체 등록
        </Button>
      </div>
    </div>
  )
}
