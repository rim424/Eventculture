<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket - Réservation #{{ $reservation->id_reservation }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 20px;
        }
        .ticket {
            border: 2px dashed #6B5B95;
            border-radius: 15px;
            padding: 20px;
            max-width: 500px;
            margin: auto;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #6B5B95;
            margin: 0;
        }
        .content {
            padding: 20px 0;
        }
        .event-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        .info {
            margin-bottom: 10px;
        }
        .info strong {
            color: #6B5B95;
        }
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <h1>EventCulture</h1>
            <p>TICKET D'ENTRÉE</p>
        </div>

        <div class="content">
            <div class="event-title">
                {{ $reservation->evenement->titre }}
            </div>

            <div class="info">
                <strong>Réservation n°</strong> {{ $reservation->id_reservation }}
            </div>
            <div class="info">
                <strong>Client :</strong> {{ $reservation->utilisateur->prenom }} {{ $reservation->utilisateur->nom }}
            </div>
            <div class="info">
                <strong>Date :</strong> {{ \Carbon\Carbon::parse($reservation->evenement->date_debut)->format('d/m/Y à H:i') }}
            </div>
            <div class="info">
                <strong>Lieu :</strong> {{ $reservation->evenement->lieu }}
            </div>
            <div class="info">
                <strong>Places :</strong> {{ $reservation->nombre_places }}
            </div>
            <div class="info">
                <strong>Prix total :</strong> {{ $reservation->evenement->prix * $reservation->nombre_places }} DH
            </div>

            <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=RES{{ $reservation->id_reservation }}" alt="QR Code">
            </div>
        </div>

        <div class="footer">
            <p>Présentez ce ticket à l'entrée de l'événement</p>
            <p>EventCulture - Plateforme d'événements culturels</p>
        </div>
    </div>
</body>
</html>