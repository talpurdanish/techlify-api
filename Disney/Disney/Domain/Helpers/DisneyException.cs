using System.Runtime.Serialization;

namespace Disney.Domain.Helpers
{
    public class DisneyException : Exception
    {
        public override string Message { get; } = string.Empty;



        public DisneyException()
        {
        }

        public DisneyException(string? message) : base(message)
        {
            Message = message!;
        }

        public DisneyException(string? message, Exception? innerException) : base(message, innerException)
        {
            Message = message!;

        }


    }
}
