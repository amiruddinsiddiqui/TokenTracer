import config from "../../config/config.js";

function formatMoney(n) {
    return `$${Number(n ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function buildAuditEmailSubject(audit) {
    const monthly =
        audit?.total_monthly_savings ?? audit?.totalMonthlySavings ?? 0;
    if (monthly > 0) {
        return `Your AI spend audit — save ${formatMoney(monthly)}/month`;
    }
    return 'Your AI spend audit is ready';
}

export function buildAuditEmailHtml({ email, audit, shareUrl }) {
    const monthly =
        audit?.total_monthly_savings ?? audit?.totalMonthlySavings ?? 0;
    const annual =
        audit?.total_annual_savings ?? audit?.totalAnnualSavings ?? monthly * 12;
    const summary = audit?.summary ?? 'Your personalized audit summary is ready.';
    const showTokenTracer = monthly > 500;
    const isOptimal = monthly < 100;

    const credexBlock = showTokenTracer
        ? `<p style="margin:16px 0;padding:12px;background:#f0fdf4;border-left:4px solid #16a34a;">
        <strong>High savings detected.</strong> TokenTracer helps startups buy discounted AI tool credits (Cursor, Claude, ChatGPT Enterprise, and more).
        <a href={config.frontendUrl.url}>Book a consultation</a> to capture savings beyond plan changes.
      </p>`
        : '';

    const optimalBlock = isOptimal
        ? `<p style="color:#555;">Your stack looks fairly optimized today. We'll email you when new rules apply to tools in your stack.</p>`
        : '';

    return `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 8px;">Token Tracer — Audit Report</h1>
  <p style="color:#555;margin:0 0 20px;">Hi — here's the audit you requested for <strong>${email}</strong>.</p>

  <div style="background:#f8fafc;padding:16px;border-radius:8px;margin-bottom:20px;">
    <p style="margin:0;font-size:14px;color:#64748b;">Potential savings</p>
    <p style="margin:4px 0 0;font-size:28px;font-weight:700;">${formatMoney(monthly)}<span style="font-size:16px;font-weight:400;color:#64748b;">/month</span></p>
    <p style="margin:4px 0 0;color:#64748b;">${formatMoney(annual)}/year</p>
  </div>

  <p style="margin:0 0 16px;">${summary}</p>
  ${credexBlock}
  ${optimalBlock}

  ${
        shareUrl
            ? `<p><a href="${shareUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">View shareable report</a></p>`
            : ''
    }

  <p style="margin-top:32px;font-size:12px;color:#94a3b8;">You're receiving this because you saved your audit at Token Tracer. Not you? Ignore this email.</p>
</body>
</html>`;
}

export function buildAuditEmailText({ email, audit, shareUrl }) {
    const monthly =
        audit?.total_monthly_savings ?? audit?.totalMonthlySavings ?? 0;
    const annual =
        audit?.total_annual_savings ?? audit?.totalAnnualSavings ?? monthly * 12;
    const summary = audit?.summary ?? '';
    const lines = [
        `Token Tracer — Audit Report`,
        ``,
        `Hi — audit for ${email}`,
        ``,
        `Potential savings: $${monthly}/month ($${annual}/year)`,
        ``,
        summary,
        ``,
    ];
    if (monthly > 500) {
        lines.push(
            `High savings: TokenTracer may help with discounted AI credits — https://credex.rocks`,
            ``,
        );
    }
    if (shareUrl) {
        lines.push(`Share link: ${shareUrl}`, ``);
    }
    return lines.join('\n');
}
