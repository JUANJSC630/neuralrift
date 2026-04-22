<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma tu suscripción</title>
</head>
<body style="margin:0;padding:0;background-color:#080B12;font-family:system-ui,-apple-system,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#080B12;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <span style="font-size:28px;font-weight:900;background:linear-gradient(to right,#7C6AF7,#06B6D4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                                NeuralRift
                            </span>
                        </td>
                    </tr>
                    <!-- Card -->
                    <tr>
                        <td style="background-color:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;">
                            <h1 style="margin:0 0 16px;color:#F1F5F9;font-size:24px;font-weight:700;">
                                ¡Confirma tu suscripción!
                            </h1>
                            <p style="margin:0 0 24px;color:#94A3B8;font-size:15px;line-height:1.6;">
                                Alguien (esperamos que tú) se suscribió a la newsletter de NeuralRift con este email.
                                Haz clic en el botón para confirmar tu suscripción y empezar a recibir contenido.
                            </p>
                            <table role="presentation" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="border-radius:10px;background-color:#7C6AF7;">
                                        <a href="{{ route('newsletter.confirm', $subscriber->token) }}"
                                           style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
                                            Confirmar suscripción
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:24px 0 0;color:#6B7280;font-size:13px;line-height:1.5;">
                                Si no solicitaste esta suscripción, puedes ignorar este email.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:24px;color:#6B7280;font-size:12px;">
                            © {{ date('Y') }} NeuralRift · Tecnología, IA y herramientas para construir mejor
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
