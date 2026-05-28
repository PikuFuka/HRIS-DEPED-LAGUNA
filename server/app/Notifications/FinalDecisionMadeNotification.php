<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Modules\Recruitment\Models\FinalDecision;

class FinalDecisionMadeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $decision;

    /**
     * Create a new notification instance.
     */
    public function __construct(FinalDecision $decision)
    {
        $this->decision = $decision;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->decision->decision;
        return (new MailMessage)
                    ->subject('Application Decision: ' . $status)
                    ->greeting('Hello ' . $notifiable->first_name . ',')
                    ->line('A final decision has been made on your application for ' . $this->decision->application->vacancy->plantillaItem->position_title . '.')
                    ->line('Decision: ' . $status)
                    ->line('Remarks: ' . ($this->decision->remarks ?? 'None'))
                    ->action('View Dashboard', url('/'))
                    ->line('Thank you for applying with us!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'FinalDecision',
            'decision_id' => $this->decision->id,
            'status' => $this->decision->decision,
            'message' => 'Your application decision is: ' . $this->decision->decision,
        ];
    }
}
