<!DOCTYPE html>
<html>
<head>
    <title>Confirmation de réservation</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: auto; padding: 20px; }
        .header { background: #6B5B95; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .button { background: #6B5B95; color: white; padding: 10px 20px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EventCulture</h1>
            <p>Confirmation de réservation</p>
        </div>
        <div class="content">
            <p>Bonjour <strong>{{ $reservation->utilisateur->prenom }} {{ $reservation->utilisateur->nom }}</strong>,</p>
            <p>Votre réservation a été confirmée avec succès !</p>
            
            <h3>Détails de l'événement :</h3>
            <ul>
                <li><strong>Événement :</strong> {{ $reservation->evenement->titre }}</li>
                <li><strong>Date :</strong> {{ \Carbon\Carbon::parse($reservation->evenement->date_debut)->format('d/m/Y H:i') }}</li>
                <li><strong>Lieu :</strong> {{ $reservation->evenement->lieu }}</li>
                <li><strong>Nombre de places :</strong> {{ $reservation->nombre_places }}</li>
                <li><strong>Prix total :</strong> {{ $reservation->evenement->prix * $reservation->nombre_places }} DH</li>
            </ul>
            
            <p>Vous pouvez consulter vos réservations dans votre espace personnel.</p>
        </div>
        <div class="footer">
            <p>EventCulture - Plateforme de gestion d'événements culturels</p>
        </div>
    </div>
</body>
</html>