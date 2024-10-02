/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import { useNavigate } from "react-router-dom";

export function NotFound({
  code = 404,
  description,
  onBack,
}: {
  code?: ResultStatusType;
  description?: string;
  onBack?: () => void;
}) {
  const navigate = useNavigate();

  const translatedDescription = description || "Page not found";

  return (
    <div
      css={css`
        min-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
      `}
    >
      <Result
        status={`${code}`}
        title={`${code}`}
        subTitle={translatedDescription}
        extra={
          <Button
            type="primary"
            onClick={() => (onBack && onBack()) || navigate("/")}
          >
            {"Go to home page"}
          </Button>
        }
      />
    </div>
  );
}
